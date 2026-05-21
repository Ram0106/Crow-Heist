import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import HeistTopBar from '../components/HeistTopBar';
import ObjectCard from '../components/ObjectCard';
import LeaderboardTable from '../components/LeaderboardTable';
import { getDailyHeist, submitDailyHeist } from '../api/heist';
import { getDailyLeaderboard } from '../api/leaderboard';
import { getPlayer } from '../api/player';
import { useRequirePlayer } from '../hooks/useRequirePlayer';
import { useHeistStore } from '../store/heistStore';
import { usePlayerStore } from '../store/playerStore';

export default function DailyHeist() {
  const playerId = useRequirePlayer();
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const {
    activeLevel,
    selectedObjects,
    elapsedTime,
    startedAt,
    setActiveLevel,
    startTimer,
    tick,
    toggleObject
  } = useHeistStore();
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const submittedRef = useRef(false);

  const submitCurrentHeist = useCallback(async () => {
    if (!activeLevel || !playerId || submittedRef.current) return;

    submittedRef.current = true;

    try {
      await submitDailyHeist({
        player_id: playerId,
        level_number: activeLevel.level_number,
        selected_object_ids: selectedObjects.map((object) => object.id || object._id),
        time_taken_seconds: elapsedTime
      });

      const [leaderboardResponse, playerResponse] = await Promise.all([
        getDailyLeaderboard(),
        getPlayer(playerId)
      ]);
      setLeaderboard(leaderboardResponse.data.leaderboard.slice(0, 10));
      setPlayer(playerResponse.data.player);
      setPanelOpen(true);
    } catch (requestError) {
      submittedRef.current = false;
      setError(requestError.message);
    }
  }, [activeLevel, elapsedTime, playerId, selectedObjects, setPlayer]);

  useEffect(() => {
    submittedRef.current = false;
    setLoading(true);
    let isMounted = true;
    let timerId;

    getDailyHeist()
      .then((response) => {
        if (!isMounted) return;
        setActiveLevel(response.data.level);
        timerId = setTimeout(() => {
          startTimer();
          setLoading(false);
        }, 2000);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setError(requestError.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [setActiveLevel, startTimer]);

  useEffect(() => {
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (!activeLevel || !startedAt || submittedRef.current) return;
    if (elapsedTime >= activeLevel.time_limit_seconds) {
      submitCurrentHeist();
    }
  }, [activeLevel, elapsedTime, startedAt, submitCurrentHeist]);

  if (error) {
    return (
      <AppLayout>
        <div className="cyber-card p-6 border border-accent-danger/50 bg-accent-danger/5 text-accent-danger">
          {error}
        </div>
      </AppLayout>
    );
  }

  if (!activeLevel || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            <p className="mt-4 text-sm uppercase tracking-widest text-text-muted">
              Loading Daily Operation...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative">
        {/* Daily Heist Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent-gold animate-pulse" />
            <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">
              Limited Time Operation
            </p>
          </div>
          <div className="flex-1 h-px bg-cyber-border" />
        </motion.div>

        <HeistTopBar
          level={activeLevel}
          selectedObjects={selectedObjects}
          elapsedTime={elapsedTime}
          timerStarted={Boolean(startedAt)}
          onSubmit={submitCurrentHeist}
        />

        {/* Objects Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {activeLevel.objects.map((object, index) => (
            <motion.div
              key={object.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.06,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
            >
              <ObjectCard
                object={object}
                selected={selectedObjects.some((item) => item.id === object.id)}
                onToggle={toggleObject}
              />
            </motion.div>
          ))}
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-full bg-cyber-card border-l border-cyber-border p-6 md:w-[450px]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">Daily Rankings</p>
                  <h2 className="text-3xl font-bold text-text-primary uppercase tracking-wider mt-1">
                    Top 10
                  </h2>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-cyber-border text-text-muted hover:text-text-primary hover:border-accent-primary transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <div className="cyber-card overflow-hidden">
                <LeaderboardTable rows={leaderboard} currentPlayerId={playerId} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        {!panelOpen && leaderboard.length > 0 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setPanelOpen(true)}
            className="fixed right-4 top-24 z-40 flex items-center gap-2 rounded-xl border border-accent-gold/30 bg-cyber-card/90 backdrop-blur px-4 py-3 text-sm text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10 transition-all duration-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold animate-pulse" />
            View Rankings
          </motion.button>
        )}
      </div>
    </AppLayout>
  );
}
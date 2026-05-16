import { useCallback, useEffect, useRef, useState } from 'react';
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
    let isMounted = true;
    let timerId;

    getDailyHeist()
      .then((response) => {
        if (!isMounted) return;
        setActiveLevel(response.data.level);
        timerId = setTimeout(() => startTimer(), 2000);
      })
      .catch((requestError) => setError(requestError.message));

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
        <div className="sharp-panel p-6 text-crow-red">{error}</div>
      </AppLayout>
    );
  }

  if (!activeLevel) {
    return (
      <AppLayout>
        <div className="sharp-panel p-6 text-crow-muted">Loading daily heist...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative overflow-hidden">
        <HeistTopBar
          level={activeLevel}
          selectedObjects={selectedObjects}
          elapsedTime={elapsedTime}
          timerStarted={Boolean(startedAt)}
          onSubmit={submitCurrentHeist}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {activeLevel.objects.map((object) => (
            <ObjectCard
              key={object.id}
              object={object}
              selected={selectedObjects.some((item) => item.id === object.id)}
              onToggle={toggleObject}
            />
          ))}
        </div>
        <aside
          className={`sharp-panel absolute right-0 top-0 h-full w-full bg-crow-black p-5 transition-transform duration-500 md:w-[430px] ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-crow-gold">Daily Board</p>
          <h2 className="location-font mt-2 text-4xl text-white">Top 10</h2>
          <div className="mt-6">
            <LeaderboardTable rows={leaderboard} currentPlayerId={playerId} />
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import HeistTopBar from '../components/HeistTopBar';
import ObjectCard from '../components/ObjectCard';
import { startHeist, submitHeist } from '../api/heist';
import { getPlayer } from '../api/player';
import { useRequirePlayer } from '../hooks/useRequirePlayer';
import { useHeistStore } from '../store/heistStore';
import { usePlayerStore } from '../store/playerStore';

export default function Heist() {
  const navigate = useNavigate();
  const { levelId } = useParams();
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
    toggleObject,
    setHeistResult
  } = useHeistStore();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(3);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const submittedRef = useRef(false);

  const submitCurrentHeist = useCallback(async () => {
    if (!activeLevel || !playerId || submittedRef.current) return;

    submittedRef.current = true;
    setSubmitting(true);

    try {
      const response = await submitHeist({
        player_id: playerId,
        level_number: activeLevel.level_number,
        selected_object_ids: selectedObjects.map((object) => object.id || object._id),
        time_taken_seconds: elapsedTime
      });
      setHeistResult(response.data);

      const playerResponse = await getPlayer(playerId);
      setPlayer(playerResponse.data.player);

      navigate('/result', { state: { result: response.data, mode: 'heist', levelNumber: activeLevel.level_number } });
    } catch (requestError) {
      submittedRef.current = false;
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }, [activeLevel, elapsedTime, navigate, playerId, selectedObjects, setHeistResult, setPlayer]);

  useEffect(() => {
    if (!playerId) return;
    submittedRef.current = false;
    setShowCountdown(true);
    setCountdownValue(3);
    let isMounted = true;
    let timerId;

    startHeist({ player_id: playerId, level_number: Number(levelId) })
      .then((response) => {
        if (!isMounted) return;
        setActiveLevel(response.data.level);

        let count = 3;
        const countdownInterval = setInterval(() => {
          if (!isMounted) {
            clearInterval(countdownInterval);
            return;
          }
          count--;
          if (count > 0) {
            setCountdownValue(count);
          } else {
            clearInterval(countdownInterval);
            setShowCountdown(false);
            startTimer();
          }
        }, 700);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setError(requestError.message);
      });

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [levelId, playerId, setActiveLevel, startTimer]);

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
        <div className="sharp-panel p-6 text-crow-muted">Loading heist...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AnimatePresence>
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.span
              key={countdownValue}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-9xl font-bold text-crow-gold"
            >
              {countdownValue}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <HeistTopBar
        level={activeLevel}
        selectedObjects={selectedObjects}
        elapsedTime={elapsedTime}
        timerStarted={Boolean(startedAt)}
        onSubmit={submitCurrentHeist}
        hintsEnabled={hintsEnabled}
        onToggleHints={() => setHintsEnabled(prev => !prev)}
      />
      {submitting ? <p className="mb-4 text-crow-gold">Submitting...</p> : null}
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
              hintsEnabled={hintsEnabled}
            />
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}

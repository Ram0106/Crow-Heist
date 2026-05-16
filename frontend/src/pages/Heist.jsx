import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    let isMounted = true;
    let timerId;

    startHeist({ player_id: playerId, level_number: Number(levelId) })
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
      <HeistTopBar
        level={activeLevel}
        selectedObjects={selectedObjects}
        elapsedTime={elapsedTime}
        timerStarted={Boolean(startedAt)}
        onSubmit={submitCurrentHeist}
      />
      {submitting ? <p className="mb-4 text-crow-gold">Submitting...</p> : null}
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
    </AppLayout>
  );
}

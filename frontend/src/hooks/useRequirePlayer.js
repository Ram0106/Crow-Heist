import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../store/playerStore';

export function useRequirePlayer() {
  const navigate = useNavigate();
  const playerId = usePlayerStore((state) => state.player_id);

  useEffect(() => {
    if (!playerId) {
      navigate('/');
    }
  }, [navigate, playerId]);

  return playerId;
}

import api from './client';

export function registerPlayer(username) {
  return api.post('/api/player/register', { username });
}

export function getPlayer(playerId) {
  return api.get(`/api/player/${playerId}`);
}

export function getAvailableLevels(playerId) {
  return api.get('/api/levels', {
    params: { player_id: playerId }
  });
}

import api from './client';

export function getDailyLeaderboard() {
  return api.get('/api/leaderboard/daily');
}

export function getGlobalLeaderboard() {
  return api.get('/api/leaderboard/global');
}

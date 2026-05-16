import client from './client';

export const getPlayerLevelResults = (playerId) =>
  client.get(`/level-results/player/${playerId}`);
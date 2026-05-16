import client from './client';

export const getPlayerCollection = (playerId) =>
  client.get(`/collection/player/${playerId}`);
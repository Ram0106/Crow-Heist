import client from './client';

export const getAllAchievements = () =>
  client.get('/achievements');

export const getPlayerAchievements = (playerId) =>
  client.get(`/achievements/player/${playerId}`);
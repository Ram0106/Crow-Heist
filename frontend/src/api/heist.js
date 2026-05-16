import api from './client';

export function startHeist({ player_id, level_number }) {
  return api.post('/api/heist/start', { player_id, level_number });
}

export function submitHeist({ player_id, level_number, selected_object_ids, time_taken_seconds }) {
  return api.post('/api/heist/submit', {
    player_id,
    level_number,
    selected_object_ids,
    time_taken_seconds
  });
}

export function getDailyHeist() {
  return api.get('/api/daily-heist');
}

export function submitDailyHeist({ player_id, level_number, selected_object_ids, time_taken_seconds }) {
  return api.post('/api/daily-heist/submit', {
    player_id,
    level_number,
    selected_object_ids,
    time_taken_seconds
  });
}

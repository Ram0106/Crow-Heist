import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlayerStore = create(
  persist(
    (set) => ({
      player_id: null,
      username: '',
      current_level: 1,
      unlocked_levels: [1],
      total_score: 0,
      nest_items: [],
      daily_streak: 0,
      setPlayer: (player) =>
        set({
          player_id: player._id || player.id,
          username: player.username,
          current_level: player.current_level || 1,
          unlocked_levels: player.unlocked_levels || [1],
          total_score: player.total_score || 0,
          nest_items: player.nest_items || [],
          daily_streak: player.daily_streak || 0
        }),
      clearPlayer: () =>
        set({
          player_id: null,
          username: '',
          current_level: 1,
          unlocked_levels: [1],
          total_score: 0,
          nest_items: [],
          daily_streak: 0
        })
    }),
    {
      name: 'crow-heist-player'
    }
  )
);

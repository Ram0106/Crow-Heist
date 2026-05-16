import { create } from 'zustand';

export const useHeistStore = create((set, get) => ({
  activeLevel: null,
  selectedObjects: [],
  elapsedTime: 0,
  heistResult: null,
  startedAt: null,
  setActiveLevel: (level) =>
    set({
      activeLevel: level,
      selectedObjects: [],
      elapsedTime: 0,
      heistResult: null,
      startedAt: null
    }),
  startTimer: () => set({ startedAt: Date.now(), elapsedTime: 0 }),
  tick: () => {
    const { startedAt } = get();
    if (!startedAt) return;
    set({ elapsedTime: Math.floor((Date.now() - startedAt) / 1000) });
  },
  toggleObject: (object) =>
    set((state) => {
      const exists = state.selectedObjects.some((item) => item.id === object.id);
      return {
        selectedObjects: exists
          ? state.selectedObjects.filter((item) => item.id !== object.id)
          : [...state.selectedObjects, object]
      };
    }),
  setHeistResult: (result) => set({ heistResult: result }),
  resetHeist: () =>
    set({
      activeLevel: null,
      selectedObjects: [],
      elapsedTime: 0,
      heistResult: null,
      startedAt: null
    })
}));

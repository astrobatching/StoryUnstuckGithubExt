import { create } from 'zustand';

interface TestStore {
  count: number;
  increment: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
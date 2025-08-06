import { create } from 'zustand';

interface MosqueStore {
  selectedMosqueIndex: number;
  setSelectedMosqueIndex: (index: number) => void;
}

export const useMosqueStore = create<MosqueStore>((set) => ({
  selectedMosqueIndex: 0,
  setSelectedMosqueIndex: (index) => set({ selectedMosqueIndex: index }),
}));

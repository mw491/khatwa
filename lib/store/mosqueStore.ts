import { create } from 'zustand';

interface MosqueStore {
  selectedMosqueID: string;
  setSelectedMosqueID: (id: string) => void;
}

export const useMosqueStore = create<MosqueStore>((set) => ({
  selectedMosqueID: "",
  setSelectedMosqueID: (id) => set({ selectedMosqueID: id }),
}));

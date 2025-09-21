import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jsonZustandStorage } from "../storage/zustandPersist";

// selected mosque
interface SelectedMosqueStore {
  selectedMosqueID: string;
  setSelectedMosqueID: (id: string) => void;
}

export const useSelectedMosqueStore = create<SelectedMosqueStore>()(
  persist(
    (set) => ({
      selectedMosqueID: "",
      setSelectedMosqueID: (id) => set({ selectedMosqueID: id }),
    }),
    {
      name: "selected-mosque",
      storage: jsonZustandStorage,
    }
  )
);

// pinned mosques
interface PinnedMosquesStore {
  pinnedMosques: string[];
  togglePinnedMosque: (id: string) => void;
}

export const usePinnedMosquesStore = create<PinnedMosquesStore>()(
  persist(
    (set) => ({
      pinnedMosques: [],
      togglePinnedMosque: (id) =>
        set((state) => ({
          pinnedMosques: state.pinnedMosques.includes(id)
            ? state.pinnedMosques.filter((mosque) => mosque !== id)
            : [...state.pinnedMosques, id],
        })),
    }),
    {
      name: "pinned-mosques",
      storage: jsonZustandStorage,
    }
  )
);

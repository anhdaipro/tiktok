import { create } from 'zustand';

interface ActiveVideoState {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export const useActiveVideoStore = create<ActiveVideoState>((set) => ({
  activeVideoId: null,
  setActiveVideoId: (id) => set({ activeVideoId: id }),
}));

import { create } from 'zustand';

export interface MusicState {
    setUri: (uri: string) => void;
    uri: string;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

export const useMusicStore = create<MusicState>((set) => ({
    uri: '',
    isPlaying: false,
    setUri: (uri: string) => set({ uri }),
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
}));

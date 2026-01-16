import { create } from 'zustand';

// Store riêng cho Home Tab Videos
type HomeVideoStore = {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
};

export const useHomeVideoStore = create<HomeVideoStore>((set) => ({
    currentIndex: 0,
    setCurrentIndex: (index) => {
        set({ currentIndex: index });
    },
}));

// Store riêng cho Video Feed Screen
type VideoFeedStore = {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
};

export const useVideoFeedVideoStore = create<VideoFeedStore>((set) => ({
    currentIndex: 0,
    setCurrentIndex: (index) => {
        set({ currentIndex: index });
    },
}));

// Store riêng cho Profile Screen
type ProfileVideoStore = {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
};

export const useProfileVideoStore = create<ProfileVideoStore>((set) => ({
    currentIndex: 0,
    setCurrentIndex: (index) => {
        set({ currentIndex: index });
    },
}));

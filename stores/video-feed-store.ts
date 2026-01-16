import { CommonFilters } from '@/types/api';
import { Video } from '@/types/video';
import { create } from 'zustand';

interface VideoFeedState {
  videos: Video[];
  initialIndex: number;
  params: CommonFilters;
  setFeed: (queryKey: any, params:CommonFilters, initialIndex: number) => void;
  setQueryKey: (queryKey: any) => void;
  queryKey: any;
  clearFeed: () => void;
}

export const useVideoFeedStore = create<VideoFeedState>((set) => ({
  videos: [],
  queryKey: ['videos'],
  initialIndex: 0,
  params: {
    page: 1,
    limit: 20,
  },
  setFeed: (queryKey, params, initialIndex) => set({ queryKey, params, initialIndex }),
  setQueryKey: (queryKey) => set({ queryKey }),
  clearFeed: () => set({ videos: [], initialIndex: 0 }),
}));
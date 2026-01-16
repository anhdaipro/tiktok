
import { create } from 'zustand';
interface LoadingState {
  showLoading: () => void;
  hideLoading: () => void;
  isLoading: boolean;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  showLoading: () => set({ isLoading: true }),
  hideLoading: () => set({ isLoading: false }),
}));
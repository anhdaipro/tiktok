import { MusicTrack } from '@/components/upload-video/camera-record';
import { create } from 'zustand';

export interface UploadState {
  type: 'text' | 'video' | 'image';
  // Dữ liệu cho Text-to-Image
  textToImage?: string;
  textStyle?: { bg: string; color: string };
  // Dữ liệu cho Video/Image
  mediaUri?: string;
  thumbUri?: string;
  music?: MusicTrack;
  
  // Dữ liệu chung
  caption: string;
  setCaption: (caption: string) => void;
  
  setUploadData: (data: Partial<UploadState>) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  type: 'video',
  textToImage: '',
  textStyle: undefined,
  mediaUri: undefined,
  music: undefined,
  caption: '',
  setCaption: (caption) => set({ caption }),
  setUploadData: (data) => set((state) => ({ ...state, ...data })),
  reset: () => set({ 
    type: 'video', 
    textToImage: '', 
    textStyle: undefined, 
    mediaUri: undefined, 
    music: undefined, 
    caption: '' 
  }),
}));

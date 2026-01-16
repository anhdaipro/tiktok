
import { KEY_VIDEO } from '@/constants/key-query';
import { Comment, COMMENT_OBJECT_TYPE } from '@/types/comment';
import { UploadFile } from '@/types/upload';
import { create } from 'zustand';
interface Data{
    queryKey?: any;
    relateId: string;
    objectType?: number;
    comment?:Comment;
    videoId?:string;
}
const clean = <T extends object>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;

interface CommentState {
    images:UploadFile[];
    value: string;
    setValue: (value: string| ((prev: string) => string)) => void;
    setImages: (dataOrFunc: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => void;
    setQueryKey: (queryKey: any) => void;
    setVideoId: (videoId: string) => void;
    queryKey: any;
    relateId: string;
    comment?:Comment
    videoId:string
    objectType: number;
    setRelateId: (relateId: any) => void;
    setData: (data: Data) => void;
  
}

export const useCommentStore = create<CommentState>((set) => ({
    queryKey: [KEY_VIDEO,''],
    value: '',
    videoId:'',
    setValue: (value) => set((state) => ({
    value:typeof value === 'function' ? value(state.value) : value,
    })),
    images: [],
    setVideoId: (videoId) => set({ videoId }),
    setImages: (dataOrFunc) =>
      set((state) => ({
          images:typeof dataOrFunc === 'function' ? dataOrFunc(state.images) : dataOrFunc,
  })),

  setQueryKey: (queryKey) => set({ queryKey }),
  relateId: '',
  objectType: COMMENT_OBJECT_TYPE.VIDEO,
  setRelateId: (relateId) => set({ relateId }),
  setData: (data) =>
  set((state) => ({
    ...state,
    ...clean(data),
  }))
})); 
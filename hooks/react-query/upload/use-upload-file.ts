import { showToast } from '@/services/toast';
import { UploadFile, UploadResponse } from '@/types/upload';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { useState } from 'react';
interface UploadRequest {
  file: UploadFile;
  folder: string;
  resourceType: string;
}
export const useUploadFile = () => {
  const [progress, setProgress] = useState<number>(0);

  const { mutate, isError, error, isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: UploadRequest): Promise<UploadResponse> => {
      const { file, folder, resourceType } = payload;
      const formData = new FormData();
      const cloudName = "dltj2mkhl";
      formData.append('file', file as any);
      formData.append('types', '1');
      formData.append("upload_preset", "upload");
      formData.append("folder", folder); // 👈 đây là folder đích
      const defaultConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const total = event.total ?? 1;
          const percent = Math.round((event.loaded / total) * 100);
          setProgress(percent);
        },
      };

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        formData,
        defaultConfig
      );
      console.log('data', data)
      return data;
    },
    onSuccess: () => {
      setProgress(100);
    },
    onError: () => {
      showToast({
        message: 'Upload thất bại',
        type: 'danger',
        duration: 5000,
        floating: true,
        hideOnPress: true,
      });
      setProgress(0);
    },
  });

  return {
    upload: mutate,
    uploadAsync: mutateAsync,
    progress,
    isError,
    isUploading: isPending,
    error: error,
  };
};

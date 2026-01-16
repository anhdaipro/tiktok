import { KEY_VIDEO } from "@/constants/key-query";
import VideoApi from "@/services/api/videos";
import { VideoDetail } from "@/types/video";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export type ActionType = 'like' | 'save' | 'share';

interface ActionVideoPayload {
  videoId: string;
  action: ActionType;
}

interface ActionContext {
  previousVideos?: VideoDetail;
}

export const useMutationActionVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ActionVideoPayload, ActionContext>({
    mutationFn: ({ videoId, action }: ActionVideoPayload) => VideoApi.actionVideo(videoId, action),

    // --- OPTIMISTIC UPDATE ---
    onMutate: async ({ videoId, action }) => {
      const previousVideos = queryClient.getQueryData<VideoDetail>([KEY_VIDEO, videoId]);
      queryClient.setQueryData<VideoDetail>([KEY_VIDEO, videoId], (oldData) => {
        if (!oldData) return oldData;
        switch (action) {
          case 'like':
            // Logic cho like/unlike
            const newIsLiked = !oldData.isLiked;
            const newLikeCount = newIsLiked ? oldData.countLike + 1 : oldData.countLike - 1;
            return { ...oldData, isLiked: newIsLiked, countLike: newLikeCount };
          case 'save':
            const newIsSaved = !oldData.isSaved;
            const newSaveCount = newIsSaved ? oldData.countSave + 1 : oldData.countSave - 1;
            return { ...oldData, isSaved: newIsSaved, countSave: newSaveCount };
          case 'share':
            // Share thường chỉ tăng, không giảm
            return { ...oldData, countShare: oldData.countShare + 1 };
          default:
            return oldData;
        }
      });

      return { previousVideos };
    },

    onError: (err, variables, context) => {
      if (context?.previousVideos) {
        queryClient.setQueryData([KEY_VIDEO, variables.videoId], context.previousVideos);
      }
    },

    onSettled: (data, error, { videoId }) => {
      // Refetch lại query của video đó để đảm bảo dữ liệu đồng bộ với server
      queryClient.invalidateQueries({ queryKey: [KEY_VIDEO, videoId] });
      // queryClient.invalidateQueries({ queryKey: [KEY_VIDEOS] }); // Hoặc invalidate toàn bộ list
    },
  });
};

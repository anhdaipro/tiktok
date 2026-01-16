import VideoApi from "@/services/api/videos";
import { useMutation } from "@tanstack/react-query";

export const useCreateVideo = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            return await VideoApi.createVideo(data);
        },
    });
};

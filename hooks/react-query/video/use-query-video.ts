import VideoApi from "@/services/api/videos";
import { useQuery } from "@tanstack/react-query";

const useQueryVideo = (id:string) => {
    return useQuery({
        queryKey: ['video', id],
        queryFn: () => VideoApi.fetchVideo(id),
        enabled: !!id,
        retry:1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
export default useQueryVideo;
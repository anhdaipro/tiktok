import axiosClient from "@/lib/axios";
import { CommonFilters, ScrollableResponse } from "@/types/api";
import { Video, VideoDetail } from "@/types/video";

class VideoApi {
    static async fetchVideos(params: CommonFilters): Promise<ScrollableResponse<Video>> {
        try {

            const { data } = await axiosClient.get(`/videos`, { params });
            const list = data.list;
            return { data: list, nextCursor: data.nextCursor ?? undefined };
        } catch (error: any) {
            console.log(error);
            throw new Error(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu');
        }
    }
    static async fetchVideo(id: string): Promise<VideoDetail> {
        try {
            const { data } = await axiosClient.get(`/videos/${id}`);
            return data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tải dữ liệu');
        }
    }

    static async actionVideo(videoId: string, action: string): Promise<any> {
        try {
            const { data } = await axiosClient.post(`/videos/${videoId}/action`, { action });
            return data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi chia sử dụng video');
        }
    }
    static async createVideo(payload: any): Promise<any> {
        try {
            const { data } = await axiosClient.post(`/videos`, payload);
            return data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đăng video');
        }
    }
}
export default VideoApi;
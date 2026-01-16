import axiosClient from "@/lib/axios";
import { CommonFilters, ScrollableResponse } from "@/types/api";
import { Notification } from "@/types/notification";
export class NotificationApi {
    static async fetchNotifications(params: CommonFilters): Promise<ScrollableResponse<Notification>> {
        try {
            const { data } = await axiosClient.get('/notifications', { params});
            const totalRecord = data.totalRecord;
            const list = data.list;
            return { data: list, nextCursor:data.nextCursor, totalRecord};
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || 'Lỗi khi tải thông báo');
        }
    }
}
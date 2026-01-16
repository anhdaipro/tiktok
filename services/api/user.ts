import axiosClient from "@/lib/axios";
import { ProfileApiResponse, User, UserProfile } from "@/types/user";


class UserApi {
    static async fetchProfile(id: string): Promise<UserProfile> {
        try {

            const { data } = await axiosClient.get<ProfileApiResponse>(`/users/${id}/profile`);

            return data.data; // Trả về cục { user, videos }
        } catch (error: any) {
            throw new Error(error?.message || 'Có lỗi xảy ra khi thích video');
        }

    };

    static async searchUsers(keyword: string): Promise<User[]> {
        try {
            const { data } = await axiosClient.get('/users/search', { params: { q: keyword } });
            return data.list;
        } catch (error) {
            throw new Error('Lỗi khi tìm kiếm người dùng');
        }
    }
}
export default UserApi;
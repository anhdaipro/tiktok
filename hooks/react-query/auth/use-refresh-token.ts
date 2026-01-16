import axiosClient from "@/lib/axios";
import { showToast } from "@/services/toast";
import { useAuthStore } from "@/stores/auth";
import { useLoadingStore } from "@/stores/loading-store";
import { LoginResponse } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
interface refreshToken {
    refreshToken: string;
}
const useRefreshToken = () => {
    const { signIn } = useAuthStore();
    const router = useRouter();
    const { showLoading, hideLoading } = useLoadingStore();

    return useMutation({
        mutationFn: async (data: refreshToken) => {
            showLoading();
            console.log('data', data)
            const res = await axiosClient.post('/auth/refresh-token', data);
            return res.data;
        },
        onSuccess: (data: LoginResponse) => {
            signIn(data);
            showToast({
                message: 'Đăng nhập thành công!',
                type: 'success',
            });
            router.replace('/');
        },
        onError: (error) => {
            console.error('Refresh token error:', error);
            showToast({
                message: 'Lỗi đăng nhập. Vui lòng đăng nhập lại.',
                type: 'danger',
            });
        },
        onSettled: () => {
            hideLoading();
        }
    });
}
export default useRefreshToken; 
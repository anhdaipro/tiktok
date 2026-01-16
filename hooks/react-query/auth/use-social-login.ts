import axiosClient from "@/lib/axios";
import { showToast } from "@/services/toast";
import { useAuthStore } from "@/stores/auth";
import { useLoadingStore } from "@/stores/loading-store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
interface LoginPayload {
    provider: 'google' | 'facebook'
    token: string
}
export const useMutationSocialLogin = () => {
    const login = useAuthStore((state) => state.signIn);
    const router = useRouter();
    const { showLoading, hideLoading } = useLoadingStore()
    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            showLoading()
            const res = await axiosClient.post('/auth/social-login', payload);
            return res.data;
        },
        onSuccess: (data) => {
            const { user, token: appToken } = data;
            login({ user, token: appToken }); // Lưu vào store
            showToast({ message: "Login successfully", type: "success" });
            router.replace('/');
        },
        onError: (error) => {
            showToast({ message: "Login failed", type: "danger" });
            console.log(error);
        },
        onSettled: () => {
            hideLoading()
        }
    })
}
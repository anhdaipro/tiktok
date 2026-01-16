import axios from '@/lib/axios';
import { saveBiometricCredentials } from '@/services/biometric-credentials';
import { showToast } from '@/services/toast';
import { useAuthStore } from '@/stores/auth';
import { LoginResponse } from '@/types/user';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export function useLoginMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.signIn);
  const biometricEnabled = useAuthStore((state) => state.biometricEnabled);
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<LoginResponse> => {
      const res = await axios.post('/auth/login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      console.log('data', data)
      login(data);
      if (!biometricEnabled) {
        saveBiometricCredentials(data.user.username, data.refreshToken)
      }
      showToast({ message: "Login successfully", type: "success" });
      router.replace('/'); // Chuyển về trang chủ
    },
    onError: (error: any) => {
      showToast({ message: error?.message || "Login failed", type: "danger" });
      console.log(error);
    },
    retry: false
  });
}
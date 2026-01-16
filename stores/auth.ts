
import { zustandStorage } from '@/lib/storage';
import { LoginResponse, User } from '@/types/user';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  authToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean; // ✅ cờ kiểm tra hydrate xong chưa
  status: 'idle' | 'signOut' | 'signIn';
  user: User | null;
  userId: string;
  countNotifiUnread: number;
  // 🔐 Biometric Login
  biometricEnabled: boolean; // Người dùng có bật biometric login không
  savedCredentials: { identifier: string } | null; // Lưu identifier để hiện UI
  signIn: (data: LoginResponse) => void;
  signOut: () => void;
  setHydrated: (value: boolean) => void;
  setCountNotifiUnread: (countOrFn: number | ((prev: number) => number)) => void;
  setStatus: (value: 'idle' | 'signOut' | 'signIn') => void;
  // 🔐 Biometric actions
  enableBiometricLogin: (identifier: string) => void;
  disableBiometricLogin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      user: null,
      userId: '',
      isHydrated: false,
      authToken: null,
      refreshToken: null,
      countNotifiUnread: 0,
      // 🔐 Biometric state
      biometricEnabled: false,
      savedCredentials: null,
      signIn: (data) => set((state) => ({
        authToken: data.token,
        refreshToken: data.refreshToken ? data.refreshToken : state.refreshToken,
        user: data.user,
        userId: data.user.id,
        status: 'signIn'
      })),
      setCountNotifiUnread: (countOrFn) =>
        set((state) => ({
          countNotifiUnread:
            typeof countOrFn === 'function' ? countOrFn(state.countNotifiUnread) : countOrFn,
        })),
      signOut: () => set({
        authToken: null,
        refreshToken: null,
        
        status: 'signOut',
        userId: '',
        user: null,
      }),
      setHydrated: (value) => set({ isHydrated: value }),
      setStatus: (value) => set({ status: value }),
      // 🔐 Biometric actions
      enableBiometricLogin: (identifier) => set({
        biometricEnabled: true,
        savedCredentials: { identifier },
      }),
      disableBiometricLogin: () => set({
        biometricEnabled: false,
        savedCredentials: null,
      }),
    }),
    {
      name: 'auth-storage', // Tên key trong MMKV
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        refreshToken: state.refreshToken, // Lưu refreshToken
        user: state.user,
        userId: state.userId,
        // 🔐 Persist biometric settings
        biometricEnabled: state.biometricEnabled,
        savedCredentials: state.savedCredentials,
      }),
      // ⚙️ Callback khi persist load xong
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('❌ Failed to rehydrate auth store:', error);
          return;
        }
        if (state) {
          state.setHydrated(true);
          state.setStatus(state.authToken ? 'signIn' : 'signOut');
        }
      },
    }
  )
);
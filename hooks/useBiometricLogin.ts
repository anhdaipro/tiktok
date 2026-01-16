import { useBiometric } from '@/hooks/useBiometric';
import {
    deleteBiometricCredentials,
    saveBiometricCredentials,
} from '@/services/biometric-credentials';
import { showToast } from '@/services/toast';
import { useAuthStore } from '@/stores/auth';
import { useState } from 'react';

export interface BiometricLoginOptions {
    identifier: string;
    refreshToken: string; // Đổi từ token sang refreshToken
}

/**
 * Hook quản lý việc enable/disable biometric login
 */
export function useBiometricLogin() {
    const { capabilities, authenticate, getBiometricName } = useBiometric();
    const { enableBiometricLogin, disableBiometricLogin, biometricEnabled, refreshToken } =
        useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Bật biometric login
     * 1. Xác thực sinh trắc học
     * 2. Lưu refreshToken vào SecureStore
     * 3. Update auth store
     */
    const enable = async ({
        identifier,
        refreshToken,
    }: BiometricLoginOptions): Promise<boolean> => {
        if (!capabilities.isAvailable || !capabilities.isEnrolled) {
            showToast({
                message: 'Thiết bị không hỗ trợ sinh trắc học hoặc bạn chưa thiết lập',
                type: 'danger',
            });
            return false;
        }

        setIsProcessing(true);

        try {
            // Bước 1: Xác thực sinh trắc học để confirm
            const biometricResult = await authenticate({
                promptMessage: `Xác nhận bật ${getBiometricName()}`,
                cancelLabel: 'Hủy',
            });

            if (!biometricResult.success) {
                setIsProcessing(false);
                return false;
            }

            // Bước 2: Lưu refreshToken vào SecureStore
            const saveSuccess = await saveBiometricCredentials(identifier, refreshToken);

            if (!saveSuccess) {
                showToast({
                    message: 'Không thể lưu thông tin đăng nhập',
                    type: 'danger',
                });
                setIsProcessing(false);
                return false;
            }

            // Bước 3: Update auth store
            enableBiometricLogin(identifier);

            showToast({
                message: `Đăng nhập bằng ${getBiometricName()} đã được bật!`,
                type: 'success',
            });

            return true;
        } catch (error) {
            console.error('Enable biometric error:', error);
            showToast({
                message: 'Đã xảy ra lỗi khi bật biometric login',
                type: 'danger',
            });
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Tắt biometric login
     * 1. Xóa credentials từ SecureStore
     * 2. Update auth store
     */
    const disable = async (): Promise<boolean> => {
        setIsProcessing(true);

        try {
            // Bước 1: Xóa credentials
            const deleteSuccess = await deleteBiometricCredentials();

            if (!deleteSuccess) {
                showToast({
                    message: 'Không thể xóa thông tin đăng nhập',
                    type: 'danger',
                });
                setIsProcessing(false);
                return false;
            }

            // Bước 2: Update auth store
            disableBiometricLogin();

            showToast({
                message: 'Đăng nhập bằng sinh trắc học đã được tắt',
                type: 'success',
            });

            return true;
        } catch (error) {
            console.error('Disable biometric error:', error);
            showToast({
                message: 'Đã xảy ra lỗi khi tắt biometric login',
                type: 'danger',
            });
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Bật biometric với refreshToken hiện tại (không cần nhập password)
     * Gọi trong settings
     */
    const enableWithCurrentToken = async (identifier: string): Promise<boolean> => {
        if (!refreshToken) {
            showToast({
                message: 'Không tìm thấy refresh token',
                type: 'danger',
            });
            return false;
        }

        return enable({ identifier, refreshToken });
    };

    /**
     * Hiển thị prompt hỏi user có muốn bật biometric login
     * Gọi sau khi login thành công
     */
    const promptEnable = ({ identifier, refreshToken }: BiometricLoginOptions) => {
        // Không prompt nếu đã bật hoặc thiết bị không hỗ trợ
        if (biometricEnabled || !capabilities.isEnrolled) {
            return null;
        }

        return {
            shouldShow: true,
            message: `Bật đăng nhập bằng ${getBiometricName()}?`,
            description: 'Đăng nhập nhanh hơn mà không cần nhập mật khẩu',
            onConfirm: () => enable({ identifier, refreshToken }),
        };
    };

    return {
        enable,
        enableWithCurrentToken,
        disable,
        promptEnable,
        isProcessing,
        isEnabled: biometricEnabled,
        isAvailable: capabilities.isAvailable && capabilities.isEnrolled,
        biometricName: getBiometricName(),
    };
}

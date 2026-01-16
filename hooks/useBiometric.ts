import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export interface BiometricCapabilities {
    isAvailable: boolean;
    isEnrolled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
    biometricType: 'face' | 'fingerprint' | 'iris' | 'none';
}

export interface BiometricResult {
    success: boolean;
    error?: string;
    warning?: string;
}

export const useBiometric = () => {
    const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
        isAvailable: false,
        isEnrolled: false,
        supportedTypes: [],
        biometricType: 'none',
    });
    const [isChecking, setIsChecking] = useState(true);

    // Kiểm tra khả năng sinh trắc học của thiết bị
    const checkBiometricCapabilities = useCallback(async () => {
        setIsChecking(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            // Xác định loại sinh trắc học chính
            let biometricType: 'face' | 'fingerprint' | 'iris' | 'none' = 'none';
            if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                biometricType = 'face';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                biometricType = 'fingerprint';
            } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                biometricType = 'iris';
            }

            setCapabilities({
                isAvailable: hasHardware,
                isEnrolled,
                supportedTypes,
                biometricType,
            });
        } catch (error) {
            console.error('Error checking biometric capabilities:', error);
            setCapabilities({
                isAvailable: false,
                isEnrolled: false,
                supportedTypes: [],
                biometricType: 'none',
            });
        } finally {
            setIsChecking(false);
        }
    }, []);

    // Lấy tên sinh trắc học cho UI
    const getBiometricName = useCallback(() => {
        switch (capabilities.biometricType) {
            case 'face':
                return Platform.OS === 'ios' ? 'Face ID' : 'Nhận diện khuôn mặt';
            case 'fingerprint':
                return Platform.OS === 'ios' ? 'Touch ID' : 'Vân tay';
            case 'iris':
                return 'Mống mắt';
            default:
                return 'Sinh trắc học';
        }
    }, [capabilities.biometricType]);

    // Xác thực sinh trắc học
    const authenticate = useCallback(async (options?: {
        promptMessage?: string;
        cancelLabel?: string;
        fallbackLabel?: string;
        disableDeviceFallback?: boolean;
    }): Promise<BiometricResult> => {
        try {
            // Kiểm tra khả năng
            if (!capabilities.isAvailable) {
                return {
                    success: false,
                    error: 'Thiết bị không hỗ trợ sinh trắc học',
                };
            }

            if (!capabilities.isEnrolled) {
                return {
                    success: false,
                    error: 'Chưa thiết lập sinh trắc học trên thiết bị',
                    warning: 'Vui lòng vào Cài đặt để đăng ký vân tay hoặc Face ID',
                };
            }

            // Thực hiện xác thực
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: options?.promptMessage || `Xác thực bằng ${getBiometricName()}`,
                cancelLabel: options?.cancelLabel || 'Hủy',
                fallbackLabel: options?.fallbackLabel || 'Dùng mật khẩu',
                disableDeviceFallback: options?.disableDeviceFallback ?? false,
            });

            if (result.success) {
                return { success: true };
            } else {
                // Xử lý các loại lỗi
                let errorMessage = 'Xác thực thất bại';

                // result.error là string, không phải enum
                const errorCode = result.error as string;

                if (errorCode === 'user_cancel') {
                    errorMessage = 'Người dùng đã hủy';
                } else if (errorCode === 'system_cancel') {
                    errorMessage = 'Hệ thống đã hủy xác thực';
                } else if (errorCode === 'lockout') {
                    errorMessage = 'Đã thử quá nhiều lần. Vui lòng thử lại sau';
                } else if (errorCode === 'lockout_permanent') {
                    errorMessage = 'Sinh trắc học đã bị khóa. Vui lòng dùng mật khẩu thiết bị';
                } else if (errorCode === 'not_enrolled') {
                    errorMessage = 'Chưa thiết lập sinh trắc học';
                } else if (errorCode === 'not_available') {
                    errorMessage = 'Sinh trắc học không khả dụng';
                } else if (errorCode) {
                    errorMessage = errorCode;
                }

                return {
                    success: false,
                    error: errorMessage,
                };
            }
        } catch (error) {
            console.error('Biometric authentication error:', error);
            return {
                success: false,
                error: 'Đã xảy ra lỗi khi xác thực',
            };
        }
    }, [capabilities, getBiometricName]);

    // Kiểm tra security level
    const getSecurityLevel = useCallback(async () => {
        try {
            const level = await LocalAuthentication.getEnrolledLevelAsync();

            switch (level) {
                case LocalAuthentication.SecurityLevel.NONE:
                    return { level: 'none', description: 'Không có bảo mật' };
                case LocalAuthentication.SecurityLevel.SECRET:
                    return { level: 'secret', description: 'Mã PIN/Hình mẫu' };
                case LocalAuthentication.SecurityLevel.BIOMETRIC:
                    return { level: 'biometric', description: 'Sinh trắc học' };
                default:
                    return { level: 'unknown', description: 'Không xác định' };
            }
        } catch (error) {
            console.error('Error getting security level:', error);
            return { level: 'error', description: 'Lỗi' };
        }
    }, []);

    // Kiểm tra khi mount
    useEffect(() => {
        checkBiometricCapabilities();
    }, [checkBiometricCapabilities]);

    return {
        capabilities,
        isChecking,
        authenticate,
        getBiometricName,
        getSecurityLevel,
        refreshCapabilities: checkBiometricCapabilities,
    };
};

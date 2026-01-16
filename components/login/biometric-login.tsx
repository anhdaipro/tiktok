import useRefreshToken from '@/hooks/react-query/auth/use-refresh-token';
import { useBiometric } from '@/hooks/useBiometric';
import { getBiometricCredentials } from '@/services/biometric-credentials';
import { showToast } from '@/services/toast';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading-store';
import { useRouter } from 'expo-router';
import { Fingerprint, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

/**
 * Component hiển thị quick login bằng biometric
 * Hiện trên màn hình login nếu user đã bật biometric
 */
export function BiometricQuickLogin() {
    const { capabilities, authenticate, getBiometricName } = useBiometric();
    const { biometricEnabled, savedCredentials } = useAuthStore();
    const { mutateAsync: refreshToken, isPending } = useRefreshToken();

    // Nếu không bật biometric hoặc không có credentials, không hiển thị
    if (!biometricEnabled || !savedCredentials || !capabilities.isEnrolled) {
        return null;
    }

    const handleBiometricLogin = async () => {
        try {
            // Bước 1: Xác thực sinh trắc học
            const biometricResult = await authenticate({
                promptMessage: `Đăng nhập bằng ${getBiometricName()}`,
                cancelLabel: 'Hủy',
            });

            if (!biometricResult.success) {
                return;
            }

            // Bước 2: Lấy refreshToken từ SecureStore
            const credentials = await getBiometricCredentials();

            if (!credentials || !credentials.refreshToken) {
                console.error('No credentials or refreshToken found');
                showToast({
                    message: 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.',
                    type: 'danger',
                });
                return;
            }

            // Bước 3: Gọi API refresh để lấy token mới
            await refreshToken({ refreshToken: credentials.refreshToken });
        } catch (error) {
            console.error('Biometric login error:', error);
            showToast({
                message: 'Đã xảy ra lỗi khi đăng nhập',
                type: 'danger',
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>Hoặc</Text>
                <View style={styles.line} />
            </View>

            <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
            >

                <View style={styles.buttonContent}>
                    <Fingerprint size={40} color="#FE2C55" />
                    <Text style={styles.biometricText}>
                        Đăng nhập bằng {getBiometricName()}
                    </Text>
                    {savedCredentials && (
                        <View style={styles.userInfo}>
                            <User size={14} color="#666" />
                            <Text style={styles.identifier}>{savedCredentials.identifier}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}

interface BiometricLoginPromptProps {
    onEnableBiometric: () => void;
    identifier: string;
}

/**
 * Component hỏi user có muốn bật biometric login sau khi đăng nhập thành công
 * Hiển thị trong login mutation onSuccess
 */
export function BiometricLoginPrompt({ onEnableBiometric, identifier }: BiometricLoginPromptProps) {
    const { capabilities, getBiometricName } = useBiometric();
    const { biometricEnabled } = useAuthStore();

    // Không hiển thị nếu:
    // - Đã bật biometric
    // - Thiết bị không hỗ trợ
    // - Chưa đăng ký sinh trắc học
    if (biometricEnabled || !capabilities.isEnrolled || !capabilities.isAvailable) {
        return null;
    }

    return (
        <View style={styles.promptContainer}>
            <View style={styles.promptContent}>
                <Fingerprint size={32} color="#FE2C55" />
                <Text style={styles.promptTitle}>
                    Bật đăng nhập nhanh bằng {getBiometricName()}?
                </Text>
                <Text style={styles.promptSubtitle}>
                    Đăng nhập nhanh hơn mà không cần nhập mật khẩu
                </Text>

                <View style={styles.promptButtons}>
                    <TouchableOpacity
                        style={[styles.promptButton, styles.promptButtonPrimary]}
                        onPress={onEnableBiometric}
                    >
                        <Text style={styles.promptButtonTextPrimary}>Bật ngay</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.promptButton, styles.promptButtonSecondary]}
                        onPress={() => { }} // Close prompt
                    >
                        <Text style={styles.promptButtonTextSecondary}>Để sau</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#999',
        fontSize: 14,
    },
    biometricButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FE2C55',
    },
    buttonContent: {
        alignItems: 'center',
    },
    biometricText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
    },
    identifier: {
        fontSize: 14,
        color: '#666',
    },
    promptContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingTop: 100,
    },
    promptContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    promptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    promptSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    promptButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        width: '100%',
    },
    promptButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    promptButtonPrimary: {
        backgroundColor: '#FE2C55',
    },
    promptButtonSecondary: {
        backgroundColor: '#F1F1F1',
    },
    promptButtonTextPrimary: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    promptButtonTextSecondary: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
});

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Service quản lý credentials cho biometric login
 * Sử dụng SecureStore (iOS Keychain / Android Keystore) để lưu refreshToken an toàn
 * 
 * NOTE: Lưu REFRESH TOKEN thay vì token để:
 * - RefreshToken có lifetime dài hơn
 * - An toàn hơn (token thật được tạo mới mỗi lần)
 * - Không lo token expire
 */

const CREDENTIALS_KEY = 'biometric_credentials';

export interface BiometricCredentials {
    identifier: string;
    refreshToken: string; // Lưu refreshToken thay vì token
}

/**
 * Lưu credentials để dùng cho biometric login
 * RefreshToken sẽ được mã hóa và lưu trong SecureStore (an toàn)
 */
export async function saveBiometricCredentials(
    identifier: string,
    refreshToken: string
): Promise<boolean> {
    try {
        const credentials: BiometricCredentials = {
            identifier,
            refreshToken,
        };

        await SecureStore.setItemAsync(
            CREDENTIALS_KEY,
            JSON.stringify(credentials),
            {
                // iOS: Yêu cầu biometric khi lấy
                requireAuthentication: Platform.OS === 'ios',
                // Mức độ accessibility (chỉ khi unlock)
                keychainAccessible: SecureStore.WHEN_UNLOCKED,
            }
        );

        return true;
    } catch (error) {
        console.error('Error saving biometric credentials:', error);
        return false;
    }
}

/**
 * Lấy credentials đã lưu
 * Trên iOS, có thể yêu cầu biometric tự động
 */
export async function getBiometricCredentials(): Promise<BiometricCredentials | null> {
    try {
        const credentialsJson = await SecureStore.getItemAsync(CREDENTIALS_KEY, {
            requireAuthentication: Platform.OS === 'ios',
        });

        if (!credentialsJson) {
            return null;
        }

        const credentials: BiometricCredentials = JSON.parse(credentialsJson);
        return credentials;
    } catch (error) {
        console.error('Error getting biometric credentials:', error);
        return null;
    }
}

/**
 * Xóa credentials đã lưu (khi tắt biometric login hoặc logout)
 */
export async function deleteBiometricCredentials(): Promise<boolean> {
    try {
        await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
        return true;
    } catch (error) {
        console.error('Error deleting biometric credentials:', error);
        return false;
    }
}

/**
 * Kiểm tra có credentials đã lưu không
 */
export async function hasBiometricCredentials(): Promise<boolean> {
    try {
        const credentials = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        return !!credentials;
    } catch (error) {
        return false;
    }
}

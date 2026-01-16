import { Platform } from 'react-native';
import { PERMISSIONS, Permission, RESULTS, check, openSettings, request } from 'react-native-permissions';
class Permissions {

    static async requestCameraPermission (): Promise<boolean> {
        const permission = Platform.select<Permission>({
            ios: PERMISSIONS.IOS.CAMERA,
            android: PERMISSIONS.ANDROID.CAMERA,
        }) as any;
        const status = await check(permission);

        if (status === RESULTS.GRANTED) return true;

        if (status === RESULTS.DENIED) {
            const result = await request(permission);
            return result === RESULTS.GRANTED;
        }

        if (status === RESULTS.BLOCKED) {
            openSettings();
        }
        return false;
    };
    static async requestStoragePermission(): Promise<boolean> {
        const permission = Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android:
            Platform.Version >= '33'
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        }) as any;

        if (!permission) return false;

        const status = await check(permission);

        if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
            return true;
        }

        if (status === RESULTS.DENIED) {
            const result = await request(permission);
            return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
        }

        if (status === RESULTS.BLOCKED) {
            openSettings();
        }

        return false;
    }
}

export default Permissions
import { NativeModules } from 'react-native';

/**
 * API Quản lý bộ nhớ
 */
export interface IStorageManager {
    // Lấy chi tiết dung lượng bộ nhớ (App, Hệ thống, Ứng dụng khác)
    getStorageStats(): Promise<{
        appCode: number;   // Dung lượng file cài đặt (Android only)
        appData: number;   // Dữ liệu ứng dụng (DB, Files)
        appCache: number;  // Bộ nhớ đệm (Temp)
        appDownloads: number; // Tải về (Files)
        appTotal: number;  // Tổng dung lượng app này chiếm
        systemTotal: number;    // Tổng dung lượng điện thoại
        systemFree: number;     // Dung lượng còn trống
        systemOtherApps: number; // Dung lượng bị chiếm bởi Ứng dụng khác + Hệ điều hành
    }>,

    // Dọn dẹp cache giải phóng bộ nhớ cho điện thoại
    clearCache(): Promise<boolean>,

    // Xóa tải về
    clearDownloads(): Promise<boolean>,
};
const StorageManager: IStorageManager = NativeModules.StorageManager
export default StorageManager
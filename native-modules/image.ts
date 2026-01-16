import { NativeModules } from 'react-native';
// Lấy các module native đã đăng ký phía Android/iOS
const { ImageProcessor } = NativeModules;
export interface ProcessedImage {
    uri: string;
    width: number;
    height: number;
    size: number;
}

/**
 * API Xử lý ảnh tiện lợi gọi từ mọi nơi trong app
 */
export const ImageApi = {
    // Nén ảnh: Trả về URI ảnh mới với dung lượng nhỏ hơn
    compress: (path: string, quality: number = 80, format: 'jpeg' | 'webp' | 'png' = 'jpeg'): Promise<ProcessedImage> =>
        ImageProcessor.compressImage(path, quality, format),

    // Thay đổi kích cỡ ảnh để hiển thị thumbnail mượt mà hơn
    resize: (path: string, w: number, h: number, q: number = 80): Promise<ProcessedImage> =>
        ImageProcessor.resizeImage(path, w, h, q),
};
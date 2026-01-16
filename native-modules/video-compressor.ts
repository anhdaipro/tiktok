import { NativeEventEmitter, NativeModules } from 'react-native';

const { VideoCompressor } = NativeModules;
const eventEmitter = new NativeEventEmitter(VideoCompressor);

/**
 * Các mức chất lượng nén Video
 */
export type VideoQuality = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Thông tin chi tiết của Video
 */
export interface VideoInfo {
    uri: string;
    width: number;
    height: number;
    size: number; // Kích thước file (bytes)
    duration: number; // Thời lượng (ms)
    mimeType: string;
}

/**
 * Các tùy chọn khi nén video
 */
export interface CompressionOptions {
    quality: VideoQuality;
    onProgress?: (event: { progress: number }) => void;
}

/**
 * Nén Video với khả năng lắng nghe thanh tiến độ (Progress Bar)
 * 
 * @param videoPath Đường dẫn file video gốc
 * @param options Cấu hình nén (chất lượng, callback tiến độ)
 * @returns Promise chứa URI của video đã nén
 */
export const compressVideo = async (videoPath: string, options: CompressionOptions): Promise<string> => {
    // Đăng ký nhận sự kiện Progress từ Native Module
    const sub = options.onProgress
        ? eventEmitter.addListener('VideoCompressionProgress', options.onProgress)
        : null;

    try {
        return await VideoCompressor.compressVideo(videoPath, options.quality);
    } finally {
        // Luôn luôn hủy Listener khi nén xong để tránh memory leak
        sub?.remove();
    }
};

/**
 * Ghép Video và Audio thành một file duy nhất
 * 
 * @param videoPath Đường dẫn video (có thể không có tiếng)
 * @param audioPath Đường dẫn file âm thanh (MP3, AAC, M4A...)
 * @returns Promise chứa URI của file đã ghép
 */
export const mergeAudioVideo = (videoPath: string, audioPath: string): Promise<string> =>
    VideoCompressor.mergeAudioVideo(videoPath, audioPath);

/**
 * Lấy ảnh Thumbnail tại một thời điểm nhất định
 * 
 * @param videoPath Đường dẫn video
 * @param timeMs Thời điểm lấy ảnh (milliseconds)
 * @returns Promise chứa URI của ảnh thumbnail
 */
export const generateThumbnail = (videoPath: string, timeMs: number = 0): Promise<string> =>
    VideoCompressor.generateThumbnail(videoPath, timeMs);

/**
 * Lấy các thông số chi tiết của Video (kích thước, thời lượng...)
 * 
 * @param videoPath Đường dẫn video
 * @returns Promise chứa Object VideoInfo
 */
export const getVideoInfo = (videoPath: string): Promise<VideoInfo> =>
    VideoCompressor.getVideoInfo(videoPath);

/**
 * Hủy bỏ tiến trình nén đang chạy
 */
export const cancelCompression = (): void => VideoCompressor.cancelCompression();

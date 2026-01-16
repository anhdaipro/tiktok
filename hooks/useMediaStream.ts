/**
 * Hook quản lý camera và microphone cho livestream
 * 
 * Chức năng:
 * - Truy cập camera/microphone device
 * - Tạo MediaStream (local video + audio)
 * - Bật/tắt camera
 * - Bật/tắt mic (mute/unmute)
 * - Chuyển camera trước/sau
 * - Thay đổi quality (resolution, framerate)
 */

import { useLivestreamStore } from '@/stores/livestream.store';
import { useEffect, useRef, useState } from 'react';
import { mediaDevices, MediaStream } from 'react-native-webrtc';

interface UseMediaStreamOptions {
    video?: boolean | any;  // true/false hoặc constraints object
    audio?: boolean | any;
}

// Cấu hình mặc định cho camera + mic
const DEFAULT_CONSTRAINTS: UseMediaStreamOptions = {
    video: {
        width: { ideal: 1280 },         // Độ phân giải mong muốn
        height: { ideal: 720 },         // 720p (HD)
        frameRate: { ideal: 30, max: 30 }, // 30 FPS
        facingMode: 'user',             // Camera trước (selfie)
    },
    audio: {
        echoCancellation: true,         // Khử tiếng vọng
        noiseSuppression: true,         // Giảm nhiễu
        autoGainControl: true,          // Tự động điều chỉnh âm lượng
    },
};

export const useMediaStream = (options: UseMediaStreamOptions = DEFAULT_CONSTRAINTS) => {
    // Local stream từ camera/mic
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // Trạng thái: stream đã sẵn sàng chưa
    const [isReady, setIsReady] = useState(false);

    // Lỗi nếu không truy cập được camera/mic (permission denied, device not found, etc.)
    const [error, setError] = useState<Error | null>(null);

    // Ref để lưu stream (không trigger re-render)
    const streamRef = useRef<MediaStream | null>(null);

    // Lấy state mute và camera off từ store
    const { isMuted, isCameraOff } = useLivestreamStore();

    // Effect: Khởi động stream khi mount
    useEffect(() => {
        startStream();
        return () => stopStream();  // Cleanup khi unmount
    }, []);

    // Effect: Xử lý khi toggle mute/unmute
    useEffect(() => {
        if (!streamRef.current) return;

        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !isMuted;  // enabled = true → âm thanh ON
        }
    }, [isMuted]);

    // Effect: Xử lý khi toggle camera on/off
    useEffect(() => {
        if (!streamRef.current) return;

        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !isCameraOff;  // enabled = true → video ON
        }
    }, [isCameraOff]);

    /**
     * Khởi động camera và microphone
     * Yêu cầu quyền truy cập (permissions)
     */
    const startStream = async () => {
        try {
            // Gọi mediaDevices.getUserMedia để truy cập camera/mic
            const stream = await mediaDevices.getUserMedia({
                video: options.video ?? DEFAULT_CONSTRAINTS.video,
                audio: options.audio ?? DEFAULT_CONSTRAINTS.audio,
            });

            streamRef.current = stream;
            setLocalStream(stream);
            setIsReady(true);
            setError(null);

            console.log('✅ Media stream started');
        } catch (err) {
            // Lỗi có thể do:
            // - Permission denied (người dùng từ chối)
            // - Device not found (không có camera/mic)
            // - Device in use (đang được app khác sử dụng)
            console.error('❌ Failed to get media stream:', err);
            setError(err as Error);
            setIsReady(false);
        }
    };

    /**
     * Dừng stream và giải phóng camera/mic
     * Quan trọng để tránh camera vẫn sáng sau khi thoát
     */
    const stopStream = () => {
        if (streamRef.current) {
            // Stop tất cả tracks (video + audio)
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
            streamRef.current = null;
            setLocalStream(null);
            setIsReady(false);
            console.log('🛑 Media stream stopped');
        }
    };

    /**
     * Chuyển đổi giữa camera trước và sau
     * Chỉ hoạt động trên mobile
     */
    const switchCamera = async () => {
        if (!streamRef.current) return;

        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (!videoTrack) return;

        try {
            // @ts-ignore - _switchCamera là method private của react-native-webrtc
            await videoTrack._switchCamera();
            console.log('📷 Camera switched');
        } catch (err) {
            console.error('Failed to switch camera:', err);
        }
    };

    /**
     * Thay thế track hiện tại bằng track mới
     * Dùng để thay đổi resolution hoặc framerate
     * 
     * @param kind - 'audio' hoặc 'video'
     * @param newConstraints - Constraints mới (resolution, framerate, etc.)
     */
    const replaceTrack = async (
        kind: 'audio' | 'video',
        newConstraints: any
    ) => {
        if (!streamRef.current) return;

        try {
            // Tạo stream mới với constraints mới
            const newStream = await mediaDevices.getUserMedia({
                [kind]: newConstraints,
            });

            // Tìm track cũ
            const oldTrack = streamRef.current.getTracks().find(
                (t) => t.kind === kind
            );
            const newTrack = newStream.getTracks()[0];

            // Thay thế: remove track cũ → add track mới
            if (oldTrack) {
                streamRef.current.removeTrack(oldTrack);
                oldTrack.stop();  // Giải phóng resource
            }

            streamRef.current.addTrack(newTrack);

            // Update state với stream mới
            setLocalStream(new MediaStream(streamRef.current.getTracks()));

            console.log(`✅ ${kind} track replaced`);
        } catch (err) {
            console.error(`Failed to replace ${kind} track:`, err);
        }
    };

    return {
        localStream,    // MediaStream object (để truyền cho RTCView hoặc RTCPeerConnection)
        isReady,        // true = stream đã sẵn sàng
        error,          // Error object nếu có lỗi
        startStream,    // Function để khởi động lại stream
        stopStream,     // Function để dừng stream
        switchCamera,   // Function để chuyển camera
        replaceTrack,   // Function để thay đổi quality
    };
};

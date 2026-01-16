/**
 * Hook quản lý Socket.IO connection và signaling cho WebRTC
 * 
 * Signaling = trao đổi thông tin để thiết lập kết nối WebRTC
 * Bao gồm: offer, answer, ICE candidates
 * 
 * Chức năng:
 * - Kết nối đến signaling server
 * - Gửi và nhận events (WebRTC signaling, chat, reactions, etc.)
 * - Auto reconnect khi mất kết nối
 * - Quản lý real-time features (chat, reactions, viewer count)
 */

import { useLivestreamStore } from '@/stores/livestream.store';
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// URL của signaling server
// Development: địa chỉ local IP của máy chạy server
// Production: domain của backend API
const SOCKET_URL = __DEV__
    ? 'http://192.168.1.10:3000' // ⚠️ Thay đổi thành IP của bạn
    : 'https://api.yourapp.com';

// Interface định nghĩa tất cả events có thể emit/listen
interface SignalingEvents {
    // Connection events
    'connect': () => void;
    'disconnect': () => void;
    'error': (error: Error) => void;

    // Room management
    'join-room': (data: { roomId: string; isStreamer: boolean }) => void;
    'room-created': (data: { roomId: string }) => void;
    'room-joined': (data: { roomId: string; users: string[] }) => void;
    'user-joined': (data: { userId: string; isStreamer: boolean }) => void;
    'user-left': (data: { userId: string }) => void;

    // WebRTC signaling (quan trọng!)
    'offer': (data: { from: string; offer: string }) => void;
    'answer': (data: { from: string; answer: string }) => void;
    'ice-candidate': (data: { from: string; candidate: any }) => void;

    // Real-time features
    'chat': (data: any) => void;
    'reaction': (data: any) => void;

    // Products
    'product-show': (data: { productId: string; product: any }) => void;
    'product-hide': () => void;

    // Stats
    'viewer-count': (data: { count: number }) => void;
}

export const useSignaling = (roomId: string) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const {
        setConnectionStatus,
        setViewerCount,
        addMessage,
        addReaction,
        setActiveProduct,
    } = useLivestreamStore();

    useEffect(() => {
        // Khởi tạo Socket.IO connection
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],          // Ưu tiên WebSocket (nhanh hơn polling)
            reconnection: true,                 // Tự động reconnect khi mất kết nối
            reconnectionDelay: 1000,            // Chờ 1s trước khi reconnect
            reconnectionAttempts: 5,            // Thử reconnect tối đa 5 lần
        });

        socketRef.current = socket;

        // === SOCKET EVENT HANDLERS ===

        // Xử lý khi kết nối thành công
        socket.on('connect', () => {
            console.log('✅ Connected to signaling server');
            setIsConnected(true);
            setConnectionStatus('connected');
        });

        // Xử lý khi mất kết nối
        socket.on('disconnect', () => {
            console.log('❌ Disconnected from signaling server');
            setIsConnected(false);
            setConnectionStatus('disconnected');
        });

        // Xử lý lỗi
        socket.on('error', (error) => {
            console.error('Socket error:', error);
            setConnectionStatus('failed');
        });

        // === REAL-TIME FEATURES ===

        // Chat: Nhận tin nhắn mới → thêm vào store
        socket.on('chat', (data) => {
            addMessage(data);
        });

        // Reaction: Nhận reaction (like, gift) → thêm vào store để animate
        socket.on('reaction', (data) => {
            addReaction(data);
        });

        // Product show: Hiển thị product modal
        socket.on('product-show', ({ product }) => {
            setActiveProduct(product);
        });

        // Product hide: Ẩn product modal
        socket.on('product-hide', () => {
            setActiveProduct(null);
        });

        // Viewer count: Cập nhật số người xem
        socket.on('viewer-count', ({ count }) => {
            setViewerCount(count);
        });

        // Cleanup khi unmount
        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    /**
     * Emit event đến server
     * Type-safe với SignalingEvents interface
     */
    const emit = <K extends keyof SignalingEvents>(
        event: K,
        data?: any
    ) => {
        socketRef.current?.emit(event, data);
    };

    /**
     * Listen event từ server
     * Type-safe với SignalingEvents interface
     */
    const on = <K extends keyof SignalingEvents>(
        event: K,
        callback: SignalingEvents[K]
    ) => {
        socketRef.current?.on(event as string, callback);
    };

    return {
        socket: socketRef.current,  // Socket instance (ít dùng)
        isConnected,                // Trạng thái kết nối
        emit,                       // Gửi event
        on,                         // Lắng nghe event
    };
};

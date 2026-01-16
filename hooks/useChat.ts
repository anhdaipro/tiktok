/**
 * Hook quản lý chat trong livestream
 * 
 * Chức năng:
 * - Gửi tin nhắn
 * - Nhận tin nhắn từ người khác (qua Socket.IO)
 * - Optimistic update (hiển thị tin nhắn ngay lập tức)
 * - Lưu lịch sử chat vào store
 */

import { useLivestreamStore } from '@/stores/livestream.store';
import { useSignaling } from './useSignaling';

interface UseChatOptions {
    roomId: string;        // ID phòng livestream
    userId: string;        // ID người dùng hiện tại
    username: string;      // Tên hiển thị
    avatar: string;        // Avatar URL
}

export const useChat = ({ roomId, userId, username, avatar }: UseChatOptions) => {
    // Lấy danh sách tin nhắn và action từ store
    const { messages, addMessage } = useLivestreamStore();

    // Hook signaling để emit/listen events
    const { emit, on } = useSignaling(roomId);

    /**
     * Gửi tin nhắn mới
     * 
     * Flow:
     * 1. Tạo message object với thông tin người gửi
     * 2. Add vào store ngay (optimistic update)
     * 3. Emit 'chat' event đến server
     * 4. Server broadcast đến tất cả người khác
     */
    const sendMessage = (text: string) => {
        const message = {
            id: `${userId}-${Date.now()}`,  // Unique ID
            userId,
            username,
            avatar,
            message: text,
            timestamp: Date.now(),
        };

        // Optimistic update: hiển thị tin nhắn của mình ngay lập tức
        // Không cần chờ server response
        addMessage(message);

        // Gửi đến server để broadcast cho người khác
        emit('chat', {
            roomId,
            ...message,
        });
    };

    return {
        messages,       // Danh sách tất cả tin nhắn (từ store)
        sendMessage,    // Function để gửi tin nhắn mới
    };
};

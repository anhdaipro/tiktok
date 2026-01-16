/**
 * LIVESTREAM GATEWAY - Socket.IO WebRTC Signaling
 * 
 * Xử lý:
 * - Room management (join/leave)
 * - WebRTC signaling (offer/answer/ICE candidates)
 * - Real-time chat broadcast
 * - Reaction broadcast
 * - Viewer count tracking
 */

import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} import {
    Server,
    Socket,
} from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ReactionService } from '../services/reaction.service';
import { AnalyticsService } from '../services/analytics.service';
import { StreamService } from '../services/stream.service';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard'; // JWT guard cho Socket.IO

// Room tracking (in-memory)
interface RoomData {
    streamerId: string;
    viewers: Set<string>;
}

@WebSocketGateway({
    cors: {
        origin: '*', // ⚠️ Production: restrict to your domain
        credentials: true,
    },
})
export class LivestreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(LivestreamGateway.name);

    // In-memory room tracking
    private rooms = new Map<string, RoomData>();

    constructor(
        private readonly chatService: ChatService,
        private readonly reactionService: ReactionService,
        private readonly analyticsService: AnalyticsService,
        private readonly streamService: StreamService,
    ) { }

    // ============================================
    // CONNECTION HANDLERS
    // ============================================

    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);

        // Extract user từ JWT token (middleware đã validate)
        const user = client.data.user; // Set bởi WsJwtGuard

        if (user) {
            this.logger.log(`User ${user.id} (${user.username}) connected`);
        }
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        // Cleanup: remove user khỏi tất cả rooms
        for (const [roomId, room] of this.rooms.entries()) {
            if (room.viewers.has(client.id)) {
                await this.handleLeaveRoom(client, { roomId });
            }
        }
    }

    // ============================================
    // ROOM MANAGEMENT
    // ============================================

    /**
     * Join livestream room
     * Streamer: isStreamer = true
     * Viewer: isStreamer = false
     */
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('join-room')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; isStreamer: boolean },
    ) {
        const { roomId, isStreamer } = data;
        const user = client.data.user;

        this.logger.log(`User ${user.id} joining room ${roomId} as ${isStreamer ? 'streamer' : 'viewer'}`);

        // Join Socket.IO room
        client.join(roomId);

        // Update in-memory tracking
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, {
                streamerId: isStreamer ? user.id : null,
                viewers: new Set(),
            });
        }

        const room = this.rooms.get(roomId);

        if (isStreamer) {
            room.streamerId = user.id;

            // Tạo analytics record
            await this.analyticsService.startStream(roomId, user.id);
        } else {
            room.viewers.add(client.id);

            // Notify streamer về viewer mới
            client.to(roomId).emit('user-joined', {
                userId: client.id,
                isStreamer: false,
            });
        }

        // Broadcast viewer count
        const viewerCount = room.viewers.size;
        this.server.to(roomId).emit('viewer-count', { count: viewerCount });

        // Update analytics
        await this.analyticsService.updateViewerCount(roomId, viewerCount);

        return { success: true, viewerCount };
    }

    /**
     * Leave livestream room
     */
    @SubscribeMessage('leave-room')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string },
    ) {
        const { roomId } = data;

        client.leave(roomId);

        const room = this.rooms.get(roomId);
        if (!room) return;

        // Remove viewer
        room.viewers.delete(client.id);

        // Broadcast updated viewer count
        const viewerCount = room.viewers.size;
        this.server.to(roomId).emit('viewer-count', { count: viewerCount });

        // Update analytics
        await this.analyticsService.updateViewerCount(roomId, viewerCount);

        // Notify others
        client.to(roomId).emit('user-left', { userId: client.id });

        return { success: true };
    }

    // ============================================
    // WEBRTC SIGNALING
    // ============================================

    /**
     * Forward offer từ streamer → viewer
     */
    @SubscribeMessage('offer')
    handleOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; to: string; offer: string },
    ) {
        const { roomId, to, offer } = data;

        this.logger.log(`Forwarding offer in room ${roomId}`);

        // Send offer đến viewer cụ thể
        this.server.to(to).emit('offer', {
            from: client.id,
            offer,
        });

        return { success: true };
    }

    /**
     * Forward answer từ viewer → streamer
     */
    @SubscribeMessage('answer')
    handleAnswer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; to: string; answer: string },
    ) {
        const { roomId, to, answer } = data;

        this.logger.log(`Forwarding answer in room ${roomId}`);

        // Send answer về cho streamer
        this.server.to(to).emit('answer', {
            from: client.id,
            answer,
        });

        return { success: true };
    }

    /**
     * Forward ICE candidate
     */
    @SubscribeMessage('ice-candidate')
    handleIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; candidate: any },
    ) {
        const { roomId, candidate } = data;

        // Broadcast ICE candidate đến tất cả users trong room (trừ sender)
        client.to(roomId).emit('ice-candidate', {
            from: client.id,
            candidate,
        });

        return { success: true };
    }

    // ============================================
    // CHAT
    // ============================================

    /**
     * Send chat message
     * Save to MongoDB và broadcast
     */
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('chat')
    async handleChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; message: string; images?: string[] },
    ) {
        const { roomId, message, images } = data;
        const user = client.data.user;

        // Save to MongoDB
        const chatMessage = await this.chatService.createMessage({
            roomId,
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            message,
            images: images || [],
        });

        // Broadcast to all in room
        this.server.to(roomId).emit('chat', {
            id: chatMessage._id,
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            message,
            images: images || [],
            timestamp: chatMessage.createdAt,
        });

        // Update analytics
        await this.analyticsService.incrementMessageCount(roomId);

        return { success: true, messageId: chatMessage._id };
    }

    // ============================================
    // REACTIONS
    // ============================================

    /**
     * Send reaction (like, heart, gift)
     * Save to MongoDB và broadcast
     */
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('reaction')
    async handleReaction(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; type: string; value?: number },
    ) {
        const { roomId, type, value } = data;
        const user = client.data.user;

        // Save to MongoDB
        await this.reactionService.createReaction({
            roomId,
            userId: user.id,
            username: user.username,
            type,
            value: value || 1,
        });

        // Broadcast to all in room
        this.server.to(roomId).emit('reaction', {
            userId: user.id,
            username: user.username,
            type,
            value: value || 1,
            timestamp: new Date(),
        });

        // Update analytics
        await this.analyticsService.incrementReactionCount(roomId, type);

        return { success: true };
    }

    // ============================================
    // PRODUCTS
    // ============================================

    /**
     * Show product (streamer only)
     */
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('product-show')
    handleProductShow(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; productId: string; product: any },
    ) {
        const { roomId, productId, product } = data;

        // Broadcast product display
        client.to(roomId).emit('product-show', {
            productId,
            product,
        });

        return { success: true };
    }

    /**
     * Hide product
     */
    @SubscribeMessage('product-hide')
    handleProductHide(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string },
    ) {
        const { roomId } = data;

        client.to(roomId).emit('product-hide');

        return { success: true };
    }
}

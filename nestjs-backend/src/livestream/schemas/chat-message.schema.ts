/**
 * CHAT MESSAGE SCHEMA - MongoDB
 * 
 * Lưu tin nhắn chat trong livestream
 * Reference đến PostgreSQL User và Room
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true, collection: 'chat_messages' })
export class ChatMessage {
    // Reference đến PostgreSQL Room
    @Prop({ required: true, index: true })
    roomId: string;

    // Reference đến PostgreSQL User
    @Prop({ required: true, index: true })
    userId: string;

    // Denormalized data for performance (tránh join với PostgreSQL)
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    avatar: string;

    // Nội dung tin nhắn
    @Prop({ required: true, maxlength: 500 })
    message: string;

    // Hình ảnh đính kèm (URLs)
    @Prop({ type: [String], default: [] })
    images: string[];

    // Mention users (array of user IDs)
    @Prop({ type: [String], default: [] })
    mentions: string[];

    // Soft delete
    @Prop({ default: false })
    isDeleted: boolean;

    // Timestamps tự động: createdAt, updatedAt
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

// Indexes cho query performance
ChatMessageSchema.index({ roomId: 1, createdAt: -1 });
ChatMessageSchema.index({ userId: 1 });

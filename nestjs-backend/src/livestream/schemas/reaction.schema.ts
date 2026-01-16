/**
 * REACTION SCHEMA - MongoDB
 * 
 * Lưu reactions trong livestream (like, heart, gift, coin)
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReactionDocument = Reaction & Document;

export enum ReactionType {
    LIKE = 'like',
    HEART = 'heart',
    GIFT = 'gift',
    COIN = 'coin',
}

@Schema({ timestamps: true, collection: 'reactions' })
export class Reaction {
    // Reference đến PostgreSQL Room
    @Prop({ required: true, index: true })
    roomId: string;

    // Reference đến PostgreSQL User
    @Prop({ required: true, index: true })
    userId: string;

    // Denormalized username
    @Prop({ required: true })
    username: string;

    // Loại reaction
    @Prop({
        required: true,
        enum: ReactionType,
        type: String,
    })
    type: ReactionType;

    // Value (cho gift hoặc coin - số lượng)
    @Prop({ default: 1 })
    value: number;

    // Timestamps tự động
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);

// Indexes
ReactionSchema.index({ roomId: 1, createdAt: -1 });
ReactionSchema.index({ roomId: 1, type: 1 });

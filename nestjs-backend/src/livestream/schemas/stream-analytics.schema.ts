/**
 * STREAM ANALYTICS SCHEMA - MongoDB
 * 
 * Lưu analytics và metrics của livestream
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StreamAnalyticsDocument = StreamAnalytics & Document;

// Sub-schema cho viewer history
class ViewerSnapshot {
    @Prop({ required: true })
    timestamp: Date;

    @Prop({ required: true })
    count: number;
}

@Schema({ timestamps: true, collection: 'stream_analytics' })
export class StreamAnalytics {
    // Reference đến PostgreSQL Room
    @Prop({ required: true, unique: true, index: true })
    roomId: string;

    // Reference đến PostgreSQL User (streamer)
    @Prop({ required: true, index: true })
    streamerId: string;

    // Stream lifecycle
    @Prop({ required: true })
    startTime: Date;

    @Prop()
    endTime?: Date;

    // Metrics
    @Prop({ default: 0 })
    peakViewers: number;

    @Prop({ default: 0 })
    totalMessages: number;

    @Prop({ default: 0 })
    totalReactions: number;

    @Prop({ default: 0 })
    totalGifts: number;

    @Prop({ default: 0 })
    totalRevenue: number; // Tổng doanh thu từ gifts

    // Viewer count history (mỗi phút)
    @Prop({ type: [ViewerSnapshot], default: [] })
    viewerHistory: ViewerSnapshot[];

    // Stream status
    @Prop({ default: true })
    isActive: boolean;
}

export const StreamAnalyticsSchema = SchemaFactory.createForClass(StreamAnalytics);

// Indexes
StreamAnalyticsSchema.index({ roomId: 1 });
StreamAnalyticsSchema.index({ streamerId: 1, startTime: -1 });

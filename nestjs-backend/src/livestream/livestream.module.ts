/**
 * LIVESTREAM MODULE - Main NestJS Module
 * 
 * Tích hợp:
 * - MongoDB (Mongoose) cho chat messages, reactions, analytics
 * - PostgreSQL (TypeORM) cho users, rooms (existing)
 * - Socket.IO Gateway cho WebRTC signaling
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from '../rooms/rooms.module'; // Existing PostgreSQL module
import { UsersModule } from '../users/users.module'; // Existing PostgreSQL module
import { LivestreamGateway } from './gateway/livestream.gateway';
import { LivestreamController } from './livestream.controller';
import { ChatMessage, ChatMessageSchema } from './schemas/chat-message.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { StreamAnalytics, StreamAnalyticsSchema } from './schemas/stream-analytics.schema';
import { AnalyticsService } from './services/analytics.service';
import { ChatService } from './services/chat.service';
import { ReactionService } from './services/reaction.service';
import { StreamService } from './services/stream.service';

@Module({
    imports: [
        // MongoDB Schemas
        MongooseModule.forFeature([
            { name: ChatMessage.name, schema: ChatMessageSchema },
            { name: Reaction.name, schema: ReactionSchema },
            { name: StreamAnalytics.name, schema: StreamAnalyticsSchema },
        ]),

        // Import existing PostgreSQL modules
        UsersModule,
        RoomsModule,
    ],
    controllers: [LivestreamController],
    providers: [
        LivestreamGateway,
        ChatService,
        ReactionService,
        AnalyticsService,
        StreamService,
    ],
    exports: [
        ChatService,
        ReactionService,
        AnalyticsService,
        StreamService,
    ],
})
export class LivestreamModule { }

/**
 * SIMPLE SIGNALING SERVER cho WebRTC Livestream
 * 
 * Chức năng:
 * - Quản lý rooms (phòng livestream)
 * - Forward WebRTC signaling messages (offer, answer, ICE candidates)
 * - Broadcast chat, reactions, products
 * - Track viewers và streamer
 * 
 * ⚠️ Đây là version đơn giản cho DEVELOPMENT/TESTING
 * Production cần dùng Mediasoup hoặc solution scalable hơn
 */

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.IO với CORS cho phép tất cả origins
const io = new Server(server, {
    cors: {
        origin: '*',                    // ⚠️ Development only - Production nên restrict
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3000;

// In-memory storage - Lưu thông tin rooms
// ⚠️ Sẽ mất khi restart server - Production cần dùng Redis
const rooms = new Map();

// Serve static files for web viewer
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({
        status: 'running',
        rooms: Array.from(rooms.entries()).map(([id, room]) => ({
            roomId: id,
            streamer: room.streamer ? 'connected' : 'none',
            viewers: room.viewers.length
        }))
    });
});

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join room
    socket.on('join-room', ({ roomId, isStreamer }) => {
        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                streamer: null,
                viewers: [],
                createdAt: new Date()
            });
        }

        const room = rooms.get(roomId);

        if (isStreamer) {
            room.streamer = {
                socketId: socket.id,
                joinedAt: new Date()
            };
            console.log(`📹 Streamer joined room ${roomId}`);
        } else {
            room.viewers.push({
                socketId: socket.id,
                joinedAt: new Date()
            });
            console.log(`👁️  Viewer joined room ${roomId} (${room.viewers.length} viewers)`);
        }

        // Notify others in room
        socket.to(roomId).emit('user-joined', {
            userId: socket.id,
            isStreamer,
            timestamp: new Date()
        });

        // Send viewer count
        io.to(roomId).emit('viewer-count', {
            count: room.viewers.length
        });

        // Send room info to joiner
        socket.emit('room-joined', {
            roomId,
            streamer: room.streamer?.socketId,
            viewerCount: room.viewers.length
        });
    });

    // WebRTC Signaling
    socket.on('offer', (data) => {
        const { roomId, to, offer } = data;
        if (to) {
            io.to(to).emit('offer', {
                from: socket.id,
                offer
            });
        } else {
            socket.to(roomId).emit('offer', {
                from: socket.id,
                offer
            });
        }
        console.log(`📤 Offer sent in room ${roomId}`);
    });

    socket.on('answer', (data) => {
        const { to, answer } = data;
        io.to(to).emit('answer', {
            from: socket.id,
            answer
        });
        console.log(`📥 Answer sent to ${to}`);
    });

    socket.on('ice-candidate', (data) => {
        const { roomId, to, candidate } = data;
        if (to) {
            io.to(to).emit('ice-candidate', {
                from: socket.id,
                candidate
            });
        } else {
            socket.to(roomId).emit('ice-candidate', {
                from: socket.id,
                candidate
            });
        }
    });

    // Chat
    socket.on('chat', (data) => {
        const { roomId, ...messageData } = data;
        io.to(roomId).emit('chat', messageData);
        console.log(`💬 Chat in ${roomId}:`, messageData.message);
    });

    // Reactions
    socket.on('reaction', (data) => {
        const { roomId, ...reactionData } = data;
        socket.to(roomId).emit('reaction', reactionData);
        console.log(`❤️  Reaction in ${roomId}:`, reactionData.type);
    });

    // Products
    socket.on('show-product', (data) => {
        const { roomId, product } = data;
        io.to(roomId).emit('product-show', { product });
        console.log(`🛍️  Product shown in ${roomId}`);
    });

    socket.on('hide-product', (data) => {
        const { roomId } = data;
        io.to(roomId).emit('product-hide');
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);

        // Clean up rooms
        rooms.forEach((room, roomId) => {
            // Remove from streamer
            if (room.streamer?.socketId === socket.id) {
                room.streamer = null;
                io.to(roomId).emit('streamer-left');
                console.log(`📹 Streamer left ${roomId}`);
            }

            // Remove from viewers
            const viewerIndex = room.viewers.findIndex(v => v.socketId === socket.id);
            if (viewerIndex !== -1) {
                room.viewers.splice(viewerIndex, 1);
                io.to(roomId).emit('viewer-count', {
                    count: room.viewers.length
                });
                console.log(`👁️  Viewer left ${roomId} (${room.viewers.length} remaining)`);
            }

            // Delete empty rooms
            if (!room.streamer && room.viewers.length === 0) {
                rooms.delete(roomId);
                console.log(`🗑️  Room ${roomId} deleted`);
            }
        });

        socket.broadcast.emit('user-left', { userId: socket.id });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 WebRTC Signaling Server Running

Server: http://localhost:${PORT}
Network: http://YOUR_LOCAL_IP:${PORT}

📝 Get your local IP:
   Windows: ipconfig
   Mac/Linux: ifconfig

Ready for connections...
    `);
});

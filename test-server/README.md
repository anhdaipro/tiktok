# WebRTC Test Server

Simple signaling server for local development and testing.

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Or with auto-reload
npm run dev
```

Server will start on `http://0.0.0.0:3000`

## Get Your Local IP

**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig | grep inet
```

## Update Client

Edit `hooks/useSignaling.ts`:
```typescript
const SOCKET_URL = 'http://YOUR_IP:3000';
```

Example: `http://192.168.1.10:3000`

## Test Flow

1. **Start server:** `npm start`
2. **Open app (Streamer):** Set `isStreamer: true`
3. **Open app (Viewer):** Set `isStreamer: false`
4. **Join same roomId**

## Endpoints

- `GET /` - Server status and active rooms
- WebSocket events handled automatically

## Events

### Client → Server
- `join-room` - Join a room
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate
- `chat` - Send chat message
- `reaction` - Send reaction

### Server → Client
- `user-joined` - Someone joined
- `user-left` - Someone left
- `viewer-count` - Updated count
- `chat` - New message
- `reaction` - New reaction

## Production

For production, use:
- **Mediasoup** (better performance)
- **HTTPS** (required for WebRTC)
- **TURN server** (for NAT traversal)
- **Authentication**
- **Rate limiting**

See main `implementation_plan.md` for full setup.

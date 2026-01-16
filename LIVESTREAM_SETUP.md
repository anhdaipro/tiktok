# WebRTC Livestream - Installation Guide

## 📦 Dependencies

Install required packages:

```bash
# Core WebRTC (v124+)
npm install react-native-webrtc@^124.0.7

# Socket.IO for signaling
npm install socket.io-client

# State management
npm install zustand
npm install react-native-mmkv

# Icons
npm install lucide-react-native
```

### iOS Setup

```bash
cd ios && pod install
```

**Info.plist permissions:**
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access for livestreaming</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for livestreaming</string>
```

### Android Setup

**AndroidManifest.xml:**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

---

## 🚀 Quick Start

### 1. Update Server URL

Edit `hooks/useSignaling.ts`:

```typescript
const SOCKET_URL = __DEV__
    ? 'http://YOUR_LOCAL_IP:3000'  // e.g., 192.168.1.10
    : 'https://api.yourapp.com';
```

### 2. Get Your Local IP

**Windows:**
```bash
ipconfig
# Look for IPv4 Address under Wi-Fi/Ethernet
```

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### 3. Start Test Server

See `test-server/README.md` for simple test server setup.

### 4. Test Navigation

#### Option A: From Live Screen
```typescript
// In app/live.tsx
<LiveStreamCard
    onPress={() => router.push({
        pathname: '/live-stream/room',
        params: { 
            roomId: 'test-room-123',
            isStreamer: 'true' 
        }
    })}
/>
```

#### Option B: Direct Route
```bash
# Deep link
npx uri-scheme open tiktok://live-stream/room?roomId=test&isStreamer=true --android
```

---

## 🧪 Testing

### Scenario 1: Local Testing (Same Device)

```typescript
// Terminal 1: Start server
cd test-server && node index.js

// Terminal 2: Streamer (Emulator)
npm run android

// Terminal 3: Viewer (Browser)
// Open http://YOUR_IP:3000/viewer?roomId=test
```

### Scenario 2: Real Devices (Same WiFi)

1. Streamer: Phone 1 → Open app → Start stream
2. Viewer: Phone 2 → Open app → Join room

### Scenario 3: Remote Testing (Ngrok)

```bash
# Terminal 1: Start server
node index.js

# Terminal 2: Expose with ngrok
ngrok http 3000

# Update SOCKET_URL to ngrok URL
# https://abc123.ngrok.io
```

---

## 📱 Usage

### Start Livestream (Streamer)

```typescript
import { router } from 'expo-router';

const startLivestream = () => {
    const roomId = `room-${Date.now()}`;
    
    router.push({
        pathname: '/live-stream/room',
        params: {
            roomId,
            isStreamer: 'true'
        }
    });
};
```

### Join Livestream (Viewer)

```typescript
const joinLivestream = (roomId: string) => {
    router.push({
        pathname: '/live-stream/room',
        params: {
            roomId,
            isStreamer: 'false'
        }
    });
};
```

---

## 🔧 Configuration

### Video Quality Presets

```typescript
// hooks/useMediaStream.ts

const QUALITY_PRESETS = {
    high: {
        width: 1280,
        height: 720,
        frameRate: 30
    },
    medium: {
        width: 640,
        height: 480,
        frameRate: 24
    },
    low: {
        width: 320,
        height: 240,
        frameRate: 15
    }
};
```

### Adjust Bitrate

```typescript
// In peer connection
const sender = peerConnection.addTrack(videoTrack, stream);
await sender.setParameters({
    encodings: [{
        maxBitrate: 1000000 // 1 Mbps
    }]
});
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"

**Fix:**
```bash
# Check firewall (Windows)
netsh advfirewall firewall add rule name="Node3000" dir=in action=allow protocol=TCP localport=3000

# Verify server is running
curl http://YOUR_IP:3000
```

### Issue: "Camera permission denied"

**Fix:**
```bash
# Android: Uninstall and reinstall app
adb uninstall com.yourapp
npm run android

# iOS: Settings → Your App → Enable Camera/Microphone
```

### Issue: "Black screen / No video"

**Checklist:**
- [ ] Permissions granted
- [ ] Stream is created (`localStream !== null`)
- [ ] Peer connection established (`connectionState === 'connected'`)
- [ ] Check logs for errors

```typescript
// Add debugging
console.log('Local stream:', localStream?.toURL());
console.log('Remote stream:', remoteStream?.toURL());
console.log('Connection state:', connectionState);
```

### Issue: "High latency / Lag"

**Solutions:**
1. Use lower video quality
2. Check network speed
3. Use TURN server instead of STUN
4. Enable simulcast

---

## 📊 Performance Tips

### 1. Optimize Video Settings

```typescript
const stream = await mediaDevices.getUserMedia({
    video: {
        width: 640,    // Lower resolution
        height: 480,
        frameRate: 24  // Lower FPS
    }
});
```

### 2. Limit Chat Messages

```typescript
// In store
maxMessages: 50  // Only keep last 50 messages
```

### 3. Debounce Reactions

```typescript
const sendReaction = debounce((type) => {
    socket.emit('reaction', { type });
}, 200);
```

---

## 🔐 Security

### Production Checklist

- [ ] Use HTTPS for signaling server
- [ ] Implement authentication
- [ ] Validate room access
- [ ] Rate limit chat messages
- [ ] Encrypt MMKV storage
- [ ] Use secure TURN credentials

```typescript
// Example: Auth middleware
socket.on('join-room', async ({ roomId, token }) => {
    const user = await verifyToken(token);
    if (!user) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
    }
    // ... proceed
});
```

---

## 📚 API Reference

### Store Actions

```typescript
const {
    setConnected,
    addMessage,
    addReaction,
    toggleMute,
    toggleCamera,
} = useLivestreamStore();
```

### Hook: useWebRTC

```typescript
const {
    localStream,      // MediaStream | null
    remoteStream,     // MediaStream | null
    connectionState,  // RTCPeerConnectionState
    isConnected       // boolean
} = useWebRTC({ roomId, isStreamer });
```

### Hook: useChat

```typescript
const {
    messages,        // ChatMessage[]
    sendMessage      // (text: string) => void
} = useChat({ roomId, userId, username, avatar });
```

---

## 🎯 Next Steps

1. **Test locally** with 2 devices
2. **Add authentication** (Firebase, Supabase)
3. **Implement recording** (optional)
4. **Add stats/analytics**
5. **Deploy server** (VPS, Railway, Render)
6. **Production testing**

---

## 📞 Support

If you need help:
1. Check console logs
2. Verify network connectivity
3. Test with simple server first
4. Check WebRTC browser compatibility

**Debug Tools:**
- Chrome: `chrome://webrtc-internals/`
- React Native Debugger
- Wireshark for packet analysis

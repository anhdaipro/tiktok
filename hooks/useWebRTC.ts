import { useLivestreamStore } from '@/stores/livestream.store';
import { useEffect, useRef, useState } from 'react';
import {
    MediaStream,
    RTCIceCandidate,
    RTCPeerConnection,
    RTCSessionDescription,
} from 'react-native-webrtc';
import { useMediaStream } from './useMediaStream';
import { useSignaling } from './useSignaling';

const PEER_CONNECTION_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

interface UseWebRTCOptions {
    roomId: string;
    isStreamer: boolean;
}

export const useWebRTC = ({ roomId, isStreamer }: UseWebRTCOptions) => {
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [connectionState, setConnectionState] = useState<string>('new');

    const peerConnectionRef = useRef<any>(null); // Use any to bypass type issues
    const { socket, isConnected, emit, on } = useSignaling(roomId);
    const { localStream, isReady } = useMediaStream();
    const { setConnectionStatus } = useLivestreamStore();

    useEffect(() => {
        if (!isConnected || !isReady) return;

        if (isStreamer) {
            setupStreamer();
        } else {
            setupViewer();
        }

        return () => cleanup();
    }, [isConnected, isReady, roomId]);

    /**
     * Setup cho người phát sóng (Streamer)
     * 
     * Flow:
     * 1. Tạo RTCPeerConnection
     * 2. Add local tracks (camera + mic) vào connection
     * 3. Lắng nghe ICE candidates (địa chỉ kết nối)
     * 4. Lắng nghe viewer join → gửi offer
     * 5. Nhận answer từ viewer → hoàn thành kết nối
     */
    const setupStreamer = async () => {
        try {
            // Bước 1: Tạo peer connection với STUN config
            const pc: any = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
            peerConnectionRef.current = pc;

            // Bước 2: Add local video + audio tracks vào connection
            // Các track này sẽ được gửi đến viewer
            if (localStream) {
                localStream.getTracks().forEach((track: any) => {
                    pc.addTrack(track, localStream);
                });
            }

            // Bước 3: Xử lý ICE candidates
            // ICE candidate = thông tin về cách kết nối (IP, port, protocol)
            // Mỗi khi tìm được candidate mới → gửi cho viewer qua signaling server
            pc.onicecandidate = (event: any) => {
                if (event.candidate) {
                    emit('ice-candidate', {
                        roomId,
                        candidate: event.candidate.toJSON(),
                    });
                }
            };

            // Bước 4: Theo dõi trạng thái kết nối
            // Giúp biết khi nào connected, disconnected, failed
            pc.onconnectionstatechange = () => {
                const state = pc.connectionState || 'unknown';
                setConnectionState(state);
                console.log('Connection state:', state);
            };

            // Bước 5: Lắng nghe khi có viewer join room
            // Khi viewer join → gửi offer (đề nghị kết nối)
            on('user-joined', async ({ userId }: any) => {
                console.log('Viewer joined:', userId);
                await sendOffer(userId);  // Gửi offer cho viewer này
            });

            // Bước 6: Nhận answer từ viewer
            // Answer = viewer chấp nhận offer và gửi thông tin kết nối của họ
            on('answer', async ({ from, answer }: any) => {
                if (answer) {
                    const sessionDesc = new RTCSessionDescription({
                        type: 'answer',
                        sdp: answer,  // SDP = Session Description Protocol
                    });
                    await pc.setRemoteDescription(sessionDesc);
                }
            });

            // Bước 7: Nhận ICE candidates từ viewer
            // Thêm vào connection để tìm đường kết nối tốt nhất
            on('ice-candidate', async ({ candidate }: any) => {
                if (candidate) {
                    const iceCandidate = new RTCIceCandidate(candidate);
                    await pc.addIceCandidate(iceCandidate);
                }
            });

            // Bước 8: Join room với vai trò streamer
            emit('join-room', { roomId, isStreamer: true });

            console.log('✅ Streamer setup complete');
        } catch (error) {
            console.error('❌ Streamer setup failed:', error);
            setConnectionStatus('failed');
        }
    };

    /**
     * Setup cho người xem (Viewer)
     * 
     * Flow:
     * 1. Tạo RTCPeerConnection
     * 2. Lắng nghe remote tracks (video/audio từ streamer)
     * 3. Nhận offer từ streamer
     * 4. Tạo và gửi answer
     * 5. Trao đổi ICE candidates
     */
    const setupViewer = async () => {
        try {
            // Bước 1: Tạo peer connection
            const pc: any = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
            peerConnectionRef.current = pc;

            // Bước 2: Xử lý khi nhận được remote track từ streamer
            // Track = video hoặc audio stream
            pc.ontrack = (event: any) => {
                console.log('✅ Received remote track');
                if (event.streams && event.streams[0]) {
                    setRemoteStream(event.streams[0]);  // Lưu stream để hiển thị
                }
            };

            // Bước 3: Gửi ICE candidates của viewer cho streamer
            pc.onicecandidate = (event: any) => {
                if (event.candidate) {
                    emit('ice-candidate', {
                        roomId,
                        candidate: event.candidate.toJSON(),
                    });
                }
            };

            // Bước 4: Theo dõi trạng thái kết nối
            pc.onconnectionstatechange = () => {
                const state = pc.connectionState || 'unknown';
                setConnectionState(state);
                console.log('Connection state:', state);
            };

            // Bước 5: Nhận offer từ streamer
            // Offer = đề nghị kết nối từ streamer
            on('offer', async ({ from, offer }: any) => {
                if (offer) {
                    // Set offer làm remote description
                    const sessionDesc = new RTCSessionDescription({
                        type: 'offer',
                        sdp: offer,
                    });
                    await pc.setRemoteDescription(sessionDesc);

                    // Tạo answer (chấp nhận kết nối)
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    // Gửi answer về cho streamer
                    emit('answer', {
                        roomId,
                        to: from,
                        answer: answer.sdp,
                    });
                }
            });

            // Bước 6: Nhận ICE candidates từ streamer
            on('ice-candidate', async ({ candidate }: any) => {
                if (candidate) {
                    const iceCandidate = new RTCIceCandidate(candidate);
                    await pc.addIceCandidate(iceCandidate);
                }
            });

            // Bước 7: Join room với vai trò viewer
            emit('join-room', { roomId, isStreamer: false });

            console.log('✅ Viewer setup complete');
        } catch (error) {
            console.error('❌ Viewer setup failed:', error);
            setConnectionStatus('failed');
        }
    };

    /**
     * Gửi offer (đề nghị kết nối) cho viewer cụ thể
     * Được gọi khi streamer nhận được event 'user-joined'
     * 
     * @param userId - Socket ID của viewer
     */
    const sendOffer = async (userId: string) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        try {
            // Tạo offer với thông tin về video/audio capabilities
            const offer = await pc.createOffer();

            // Lưu offer làm local description
            await pc.setLocalDescription(offer);

            // Gửi offer cho viewer qua signaling server
            emit('offer', {
                roomId,
                to: userId,
                offer: offer.sdp,
            });
        } catch (error) {
            console.error('Failed to send offer:', error);
        }
    };

    /**
     * Cleanup tất cả resources khi unmount
     * - Đóng peer connection
     * - Clear remote stream
     * - Reset connection state
     */
    const cleanup = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        setConnectionState('closed');
        console.log('🧹 WebRTC cleanup complete');
    };

    // Return các giá trị cần thiết cho component
    return {
        localStream,        // Stream từ camera/mic (cho streamer)
        remoteStream,       // Stream từ người đối diện (cho viewer)
        connectionState,    // Trạng thái kết nối WebRTC
        isConnected,        // Trạng thái kết nối Socket.IO
    };
};

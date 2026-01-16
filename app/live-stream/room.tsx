import { ChatOverlay } from '@/components/livestream/ChatOverlay';
import { ReactionOverlay } from '@/components/livestream/ReactionOverlay';
import { StreamerControls } from '@/components/livestream/StreamerControls';
import { useMediaStream } from '@/hooks/useMediaStream';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useLivestreamStore } from '@/stores/livestream.store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Users } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';

export default function LiveRoomScreen() {
    const router = useRouter();
    const { roomId, isStreamer: isStreamerParam } = useLocalSearchParams();
    const isStreamer = isStreamerParam === 'true';

    const {
        localStream,
        remoteStream,
        connectionState,
        isConnected,
    } = useWebRTC({
        roomId: roomId as string,
        isStreamer,
    });

    const { switchCamera } = useMediaStream();
    const { viewerCount, currentStream } = useLivestreamStore();

    const handleEndStream = () => {
        // TODO: Implement end stream logic
        router.back();
    };

    const renderConnectionStatus = () => {
        if (!isConnected) {
            return (
                <View style={styles.statusOverlay}>
                    <ActivityIndicator size="large" color="#FF2D55" />
                    <Text style={styles.statusText}>Đang kết nối...</Text>
                </View>
            );
        }

        if (connectionState === 'connecting') {
            return (
                <View style={styles.statusOverlay}>
                    <ActivityIndicator size="large" color="#FF2D55" />
                    <Text style={styles.statusText}>Đang thiết lập...</Text>
                </View>
            );
        }

        if (connectionState === 'failed') {
            return (
                <View style={styles.statusOverlay}>
                    <Text style={styles.statusText}>❌ Kết nối thất bại</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.retryText}>Thử lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Video Stream */}
            <View style={styles.videoContainer}>
                {isStreamer && localStream ? (
                    <RTCView
                        streamURL={localStream.toURL()}
                        style={styles.video}
                        objectFit="cover"
                        mirror={true}
                    />
                ) : remoteStream ? (
                    <RTCView
                        streamURL={remoteStream.toURL()}
                        style={styles.video}
                        objectFit="cover"
                    />
                ) : (
                    <View style={styles.placeholderVideo}>
                        <ActivityIndicator size="large" color="#FF2D55" />
                    </View>
                )}
            </View>

            {/* Connection Status Overlay */}
            {renderConnectionStatus()}

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={28} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    {currentStream && (
                        <>
                            <View style={styles.liveBadge}>
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>
                            <View style={styles.viewerCount}>
                                <Users size={16} color="#FFF" />
                                <Text style={styles.viewerCountText}>
                                    {viewerCount}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </View>

            {/* Chat Overlay */}
            <ChatOverlay
                roomId={roomId as string}
                userId="current-user-id" // TODO: Get from auth
                username="User" // TODO: Get from auth
                avatar="https://i.pravatar.cc/150" // TODO: Get from auth
            />

            {/* Reactions */}
            <ReactionOverlay />

            {/* Streamer Controls */}
            {isStreamer && (
                <StreamerControls
                    onEndStream={handleEndStream}
                    onSwitchCamera={switchCamera}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
    placeholderVideo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    statusOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 100,
    },
    statusText: {
        color: '#FFF',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '600',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#FF2D55',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 60,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 12,
    },
    liveBadge: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
    },
    liveText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    viewerCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewerCountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
});

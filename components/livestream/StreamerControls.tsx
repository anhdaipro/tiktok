import { useLivestreamStore } from '@/stores/livestream.store';
import {
    Camera,
    CameraOff,
    Mic,
    MicOff,
    PhoneOff,
    RotateCw,
} from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface StreamerControlsProps {
    onEndStream?: () => void;
    onSwitchCamera?: () => void;
}

export const StreamerControls: React.FC<StreamerControlsProps> = ({
    onEndStream,
    onSwitchCamera,
}) => {
    const { isMuted, isCameraOff, toggleMute, toggleCamera } = useLivestreamStore();

    return (
        <View style={styles.container}>
            {/* Mute/Unmute */}
            <TouchableOpacity
                style={[styles.button, isMuted && styles.buttonActive]}
                onPress={toggleMute}
            >
                {isMuted ? (
                    <MicOff size={24} color="#FFF" />
                ) : (
                    <Mic size={24} color="#FFF" />
                )}
            </TouchableOpacity>

            {/* Camera On/Off */}
            <TouchableOpacity
                style={[styles.button, isCameraOff && styles.buttonActive]}
                onPress={toggleCamera}
            >
                {isCameraOff ? (
                    <CameraOff size={24} color="#FFF" />
                ) : (
                    <Camera size={24} color="#FFF" />
                )}
            </TouchableOpacity>

            {/* Switch Camera */}
            <TouchableOpacity
                style={styles.button}
                onPress={onSwitchCamera}
            >
                <RotateCw size={24} color="#FFF" />
            </TouchableOpacity>

            {/* End Stream */}
            <TouchableOpacity
                style={[styles.button, styles.endButton]}
                onPress={onEndStream}
            >
                <PhoneOff size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 320,
        right: 16,
        flexDirection: 'column',
        gap: 12,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    buttonActive: {
        borderColor: '#FF2D55',
        backgroundColor: 'rgba(255, 45, 85, 0.3)',
    },
    endButton: {
        backgroundColor: '#FF2D55',
    },
});

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface LiveVoucherBannerProps {
    voucherValue: string;
    onPress?: () => void;
}

export const LiveVoucherBanner = ({ voucherValue, onPress }: LiveVoucherBannerProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Gradient Background */}
            <Svg
                width="100%"
                height="100%"
                style={StyleSheet.absoluteFill}
                viewBox="0 0 400 60"
                preserveAspectRatio="none"
            >
                <Defs>
                    <LinearGradient id="voucherGradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#FF4081" />
                        <Stop offset="100%" stopColor="#E91E63" />
                    </LinearGradient>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width="400"
                    height="60"
                    fill="url(#voucherGradient)"
                    rx="12"
                />
            </Svg>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <Ionicons name="gift" size={24} color="#FFF" />
                    <Text style={styles.text}>
                        Nhận voucher trị giá đến {voucherValue}
                    </Text>
                </View>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Nhận</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#FF4081',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 1,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    text: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    button: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    buttonText: {
        color: '#E91E63',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

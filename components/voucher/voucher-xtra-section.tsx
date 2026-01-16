import { useTheme } from '@/contexts/theme-context';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

interface VoucherXtraSectionProps {
    onPressReceiveAll?: () => void;
    children?: ReactNode;
}

export const VoucherXtraSection = ({ onPressReceiveAll, children }: VoucherXtraSectionProps) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Background with gradient */}
            <Svg
                width="100%"
                height="100%"
                style={StyleSheet.absoluteFill}
                viewBox="0 0 400 300"
                preserveAspectRatio="none"
            >
                <Defs>
                    <LinearGradient id="sectionGradient" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#C41E3A" />
                        <Stop offset="100%" stopColor="#8B1538" />
                    </LinearGradient>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width="400"
                    height="300"
                    fill="url(#sectionGradient)"
                    rx="16"
                />
            </Svg>

            {/* Content */}
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Voucher Xtra</Text>
                        <Text style={styles.subtitle}>Ưu đãi to, giờ có hạn!</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.receiveAllButton}
                        onPress={onPressReceiveAll}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.receiveAllText}>Nhận hết</Text>
                    </TouchableOpacity>
                </View>

                {/* Children (Voucher Cards) */}
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 200,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    content: {
        flex: 1,
        padding: 16,
        zIndex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    receiveAllButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    receiveAllText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, Ticket } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MyVoucherHeaderProps {
    count: number;
    onPress?: () => void;
}

export const MyVoucherHeader = ({ count, onPress }: MyVoucherHeaderProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Ticket size={28} color="#FFF" />
                </View>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Voucher của bạn
                    </Text>
                    <Text style={styles.subtitle}>
                        Bạn có <Text style={styles.count}>{count}</Text> voucher
                    </Text>
                </View>
            </View>

            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#FF2D55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 28,
        height: 28,
        tintColor: '#FFF',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
    },
    count: {
        color: '#FF2D55',
        fontWeight: '600',
    },
});

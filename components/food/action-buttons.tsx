import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
    onOrderPress?: () => void;
    onReservePress?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onOrderPress,
    onReservePress,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            {/* Order Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onOrderPress}
                activeOpacity={0.7}
            >
                <Ionicons name="fast-food-outline" size={20} color={colors.text} />
                <Text style={styles.buttonText}>Đơn đặt món</Text>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>

            {/* Reserve Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onReservePress}
                activeOpacity={0.7}
            >
                <Ionicons name="restaurant-outline" size={20} color={colors.text} />
                <Text style={styles.buttonText}>Đơn đặt bàn</Text>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textSecondary}
                />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 16,
            marginVertical: 8,
        },
        button: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
        },
        buttonText: {
            flex: 1,
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
        },
    });

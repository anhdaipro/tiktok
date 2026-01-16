import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionProps {
    icon: React.ElementType;
    label: string;
    badge?: number | null;
    onPress?: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({ icon: Icon, label, badge, onPress }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.quickAction} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon size={24} color={colors.text} />
                {badge && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
    quickAction: {
        alignItems: 'center',
        gap: 4,
        minWidth: 72,
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -10,
        right: -4,
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    actionLabel: {
        fontSize: 11,
        flex: 1,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 14,
    },
});

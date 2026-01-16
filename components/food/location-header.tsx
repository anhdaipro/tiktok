import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LocationHeaderProps {
    location: string;
    onBackPress?: () => void;
    onLocationPress?: () => void;
    onFavoritePress?: () => void;
    onCartPress?: () => void;
    onHomePress?: () => void;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({
    location,
    onBackPress,
    onLocationPress,
    onFavoritePress,
    onCartPress,
    onHomePress,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            {/* Left: Back button */}
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            {/* Center: Location */}
            <TouchableOpacity
                style={styles.locationContainer}
                onPress={onLocationPress}
                activeOpacity={0.7}
            >
                <View>
                    <Text style={styles.locationLabel}>Vị trí của bạn</Text>
                    <View style={styles.locationRow}>
                        <Text style={styles.locationText} numberOfLines={1}>
                            {location}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={16}
                            color={colors.text}
                            style={styles.chevron}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Right: Action icons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={onFavoritePress} style={styles.iconButton}>
                    <Ionicons name="star-outline" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
                    <Ionicons name="car-outline" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onHomePress} style={styles.iconButton}>
                    <Ionicons name="home-outline" size={22} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.background,
        },
        iconButton: {
            padding: 4,
        },
        locationContainer: {
            flex: 1,
            marginHorizontal: 12,
        },
        locationLabel: {
            fontSize: 11,
            color: colors.textSecondary,
            marginBottom: 2,
        },
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        locationText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
        },
        chevron: {
            marginLeft: 4,
        },
        actionsContainer: {
            flexDirection: 'row',
            gap: 8,
        },
    });

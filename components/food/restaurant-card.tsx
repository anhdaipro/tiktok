import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import {
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface Restaurant {
    id: string;
    name: string;
    image: ImageSourcePropType;
    rating: number;
    reviewCount: number;
    distance: string;
    hasDelivery?: boolean;
    hasDineIn?: boolean;
    badge?: 'GIẢM' | 'MỚI';
    verified?: boolean;
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    onPress?: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
    restaurant,
    onPress,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress?.(restaurant)}
            activeOpacity={0.8}
        >
            {/* Restaurant Image */}
            <View style={styles.imageContainer}>
                <Image source={restaurant.image} style={styles.image} />

                {/* Delivery/Dine-in Badge */}
                <View style={styles.badgeRow}>
                    {restaurant.hasDelivery && (
                        <View style={styles.deliveryBadge}>
                            <Ionicons name="bicycle" size={12} color="#FE2C55" />
                        </View>
                    )}
                    {restaurant.hasDineIn && (
                        <View style={styles.deliveryBadge}>
                            <Ionicons name="restaurant" size={12} color="#FE2C55" />
                        </View>
                    )}
                </View>

                {/* Discount Badge */}
                {restaurant.badge && (
                    <View
                        style={[
                            styles.discountBadge,
                            restaurant.badge === 'MỚI' && styles.newBadge,
                        ]}
                    >
                        <Text style={styles.badgeText}>{restaurant.badge}</Text>
                    </View>
                )}
            </View>

            {/* Restaurant Info */}
            <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    {restaurant.verified && (
                        <Ionicons name="checkmark-circle" size={16} color="#FE2C55" />
                    )}
                </View>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFC107" />
                    <Text style={styles.rating}>
                        {restaurant.rating}
                        <Text style={styles.reviewCount}>
                            /5 ({restaurant.reviewCount})
                        </Text>
                    </Text>
                </View>

                <Text style={styles.distance}>{restaurant.distance}</Text>
            </View>
        </TouchableOpacity>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        card: {
            width: 180,
            marginRight: 12,
            borderRadius: 12,
            backgroundColor: colors.card,
            overflow: 'hidden',
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            height: 120,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        badgeRow: {
            position: 'absolute',
            top: 8,
            left: 8,
            flexDirection: 'row',
            gap: 4,
        },
        deliveryBadge: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 12,
            paddingHorizontal: 6,
            paddingVertical: 4,
        },
        discountBadge: {
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: '#FE2C55',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
        },
        newBadge: {
            backgroundColor: '#00BFA5',
        },
        badgeText: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
        },
        infoContainer: {
            padding: 12,
        },
        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
        },
        name: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
        },
        rating: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.text,
        },
        reviewCount: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '400',
        },
        distance: {
            fontSize: 12,
            color: colors.textSecondary,
        },
    });

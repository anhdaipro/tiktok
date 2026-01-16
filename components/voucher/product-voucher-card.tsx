import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductVoucherCardProps {
    productImage: string;
    productName: string;
    discount: string;
    originalPrice?: number;
    unavailable?: boolean;
    onPress?: () => void;
}

export const ProductVoucherCard = ({
    productImage,
    productName,
    discount,
    originalPrice,
    unavailable = false,
    onPress,
}: ProductVoucherCardProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={unavailable}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: productImage }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                {unavailable && (
                    <View style={styles.unavailableOverlay}>
                        <Text style={styles.unavailableText}>Hết hàng</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                    {productName}
                </Text>

                <View style={styles.priceSection}>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discount}</Text>
                    </View>
                    {originalPrice && (
                        <Text style={styles.originalPrice}>
                            {originalPrice.toLocaleString('vi-VN')}đ
                        </Text>
                    )}
                </View>

                {unavailable && (
                    <Text style={styles.unavailableLabel}>Không mức chi tiêu tối thiểu</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 12,
    },
    imageContainer: {
        width: '100%',
        height: 160,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    unavailableOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unavailableText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        padding: 8,
    },
    productName: {
        fontSize: 13,
        marginBottom: 8,
        height: 36,
    },
    priceSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    discountBadge: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    originalPrice: {
        fontSize: 11,
        color: '#888',
        textDecorationLine: 'line-through',
    },
    unavailableLabel: {
        fontSize: 11,
        color: '#888',
        marginTop: 4,
    },
});

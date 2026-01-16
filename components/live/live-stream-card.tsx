import AnimatedBar from '@/components/common/animation-bar';
import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LiveStreamCardProps {
    id: string;
    thumbnail: string;
    viewerCount: number;
    shopAvatar: string;
    shopName: string;
    productImage: string;
    productName: string;
    productPrice: number;
    onPress?: () => void;
    isActive?: boolean;
}

export const LiveStreamCard = ({
    thumbnail,
    viewerCount,
    shopAvatar,
    shopName,
    productImage,
    productName,
    productPrice,
    onPress,
    isActive = true,
}: LiveStreamCardProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Live Stream Preview */}
            <View style={styles.videoContainer}>
                <Image source={{ uri: thumbnail }} style={styles.thumbnail} />

                {/* Live Badge */}
                <View style={styles.liveBadge}>
                    <FlexBox direction="row" gap={2} align="center" justify="center">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <AnimatedBar key={i} maxHeight={12} minHeight={4} isActive={isActive} />
                        ))}
                    </FlexBox>
                    <Text style={styles.viewerCount}>{formatViewerCount(viewerCount)}</Text>
                </View>

                {/* Shop Info Overlay */}
                <View style={styles.shopOverlay}>
                    <Image source={{ uri: shopAvatar }} style={styles.shopAvatar} />
                    <Text style={styles.shopName} numberOfLines={1}>
                        {shopName}
                    </Text>
                </View>
            </View>

            {/* Product Info */}
            <View style={styles.productContainer}>
                <Image source={{ uri: productImage }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text
                        style={[styles.productName, { color: colors.text }]}
                        numberOfLines={2}
                    >
                        {productName}
                    </Text>
                    <Text style={styles.productPrice}>
                        {productPrice.toLocaleString('vi-VN')}đ
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const formatViewerCount = (count: number): string => {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 12,
    },
    videoContainer: {
        aspectRatio: 3 / 4,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    liveBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FF2D55',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    viewerCount: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    shopOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
    },
    shopAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    shopName: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },
    productContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    productImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 13,
        lineHeight: 18,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF2D55',
    },
});

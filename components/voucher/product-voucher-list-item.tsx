import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FlexBox from '../common/flex-box';
import VerticalDashedLine from '../svg/dashed-vertical';

// Layout Constants
const LAYOUT = {
    PRODUCT_IMAGE_SIZE: 80,
    STORE_ICON_SIZE: 16,
    VOUCHER_WIDTH: 120,
    SEPARATOR_WIDTH: 12,
    CIRCLE_SIZE: 12,
    CONTAINER_MARGIN_BOTTOM: 12,
    CONTAINER_BORDER_RADIUS: 12,
    CONTAINER_MIN_HEIGHT: 124,
    STORE_HEADER_MARGIN_BOTTOM: 8,
    PRODUCT_IMAGE_BORDER_RADIUS: 8,
    BUTTON_BORDER_RADIUS: 4,
    BUTTON_MARGIN_TOP: 8,
} as const;

// Calculated Values
const SEPARATOR_POSITION = LAYOUT.VOUCHER_WIDTH - LAYOUT.SEPARATOR_WIDTH / 2;

interface ProductVoucherListItemProps {
    storeName: string;
    productImage: string;
    productName: string;
    currentPrice: number;
    originalPrice?: number;
    discount: string;
    minSpend?: string;
    unavailable?: boolean;
    onPress?: () => void;
}

export const ProductVoucherListItem = ({
    storeName,
    productImage,
    productName,
    currentPrice,
    originalPrice,
    discount,
    minSpend,
    unavailable = false,
    onPress,
}: ProductVoucherListItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={unavailable}
        >
            {/* Left: Store Info & Product Image */}
            <View style={styles.leftSection}>
                <View style={styles.storeHeader}>
                    <View style={styles.storeIcon} />
                    <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>
                        {storeName}
                    </Text>
                    <Text style={styles.chevron}>›</Text>
                </View>
                <FlexBox direction="row" gap={8}>
                    <Image
                        source={{ uri: productImage }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    {/* Middle: Product Info */}
                    <View style={styles.middleSection}>
                        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
                            {productName}
                        </Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.currentPrice}>
                                {currentPrice.toLocaleString('vi-VN')}đ
                            </Text>
                            {originalPrice && (
                                <Text style={styles.originalPrice}>
                                    {originalPrice.toLocaleString('vi-VN')}đ
                                </Text>
                            )}
                        </View>
                    </View>
                </FlexBox>
            </View>



            {/* Right: Voucher Section */}
            <View style={styles.rightSection}>
                {/*Voucher Card with cutouts */}
                <View style={styles.voucherCard}>


                    {/* Voucher Content */}
                    <View style={styles.voucherContent}>
                        <Text style={styles.discountText}>{discount}</Text>
                        {minSpend ? (
                            <Text style={styles.minSpendText}>{minSpend}</Text>
                        ) : (
                            <Text style={styles.unavailableText}>Không mức chi tiêu tối thiểu</Text>
                        )}
                    </View>
                </View>

                {/* Receive Button */}
                <TouchableOpacity style={styles.receiveButton} activeOpacity={0.8}>
                    <Text style={styles.receiveButtonText}>Nhận</Text>
                </TouchableOpacity>
            </View>

            {/* Dotted separator with circle cutouts */}
            <View style={styles.separatorContainer}>
                {/* Top circle */}
                <View style={[styles.circle, styles.topCircle, { backgroundColor: colors.background }]} />
                {/* Dashed line */}
                <VerticalDashedLine
                    height={108}
                    strokeColor={Colors.static.white}
                    strokeWidth={1}
                    dashArray={[4, 4]}
                    style={styles.dashedLine}
                />
                {/* Bottom circle */}
                <View style={[styles.circle, styles.bottomCircle, { backgroundColor: colors.background }]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: LAYOUT.CONTAINER_MARGIN_BOTTOM,
        borderRadius: LAYOUT.CONTAINER_BORDER_RADIUS,
        height: LAYOUT.CONTAINER_MIN_HEIGHT,
        position: 'relative',
    },
    leftSection: {
        flex: 1,
        padding: 8,

    },
    storeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: LAYOUT.STORE_HEADER_MARGIN_BOTTOM,
        gap: 4,
    },
    storeIcon: {
        width: LAYOUT.STORE_ICON_SIZE,
        height: LAYOUT.STORE_ICON_SIZE,
        borderRadius: LAYOUT.STORE_ICON_SIZE / 2,
        backgroundColor: '#888',
    },
    storeName: {
        fontSize: 12,
        fontWeight: '500',
    },
    chevron: {
        fontSize: 16,
        color: '#888',
    },
    productImage: {
        width: LAYOUT.PRODUCT_IMAGE_SIZE,
        height: LAYOUT.PRODUCT_IMAGE_SIZE,
        borderRadius: LAYOUT.PRODUCT_IMAGE_BORDER_RADIUS,
    },
    middleSection: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    productName: {
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 8,
    },
    priceContainer: {

    },
    currentPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FF2D55',
    },
    originalPrice: {
        fontSize: 10,
        color: '#888',
        textDecorationLine: 'line-through',
    },
    rightSection: {
        width: LAYOUT.VOUCHER_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        backgroundColor: '#2A2A2A',
    },
    voucherCard: {
        position: 'relative',
    },
    voucherContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingLeft: 12,
    },
    discountText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    minSpendText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
    unavailableText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    receiveButton: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: LAYOUT.BUTTON_BORDER_RADIUS,
        shadowColor: '#FF2D55',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        marginTop: LAYOUT.BUTTON_MARGIN_TOP,
    },
    receiveButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '400',
    },
    separatorContainer: {
        position: 'absolute',
        right: SEPARATOR_POSITION,
        top: 0,
        overflow: 'hidden',
        bottom: 0,
        width: LAYOUT.SEPARATOR_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashedLine: {

    },
    circle: {
        width: LAYOUT.CIRCLE_SIZE,
        height: LAYOUT.CIRCLE_SIZE,
        borderRadius: LAYOUT.CIRCLE_SIZE / 2,
        position: 'absolute',
    },
    topCircle: {
        top: -(LAYOUT.CIRCLE_SIZE / 2),
    },
    bottomCircle: {
        bottom: -(LAYOUT.CIRCLE_SIZE / 2),
    },
});

import FlexBox from '@/components/common/flex-box';
import { QuickAction } from '@/components/common/quick-action';
import Separator from '@/components/common/separator';
import HeaderNavigate from '@/components/layout/header';
import { ProductCard } from '@/components/shop/product-card';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { MasonryFlashList } from '@shopify/flash-list';
import {
    Bookmark,
    Calendar,
    CreditCard,
    Folder,
    HelpCircle,
    MapPin,
    MessageCircle,
    Package,
    ShoppingCart,
    Star,
    Tag,
    Truck,
    Wallet
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
const QUICK_ACTIONS_TOP = [
    { icon: Folder, label: 'Chờ thanh toán', badge: null },
    { icon: Package, label: 'Chờ vận chuyển', badge: null },
    { icon: Truck, label: 'Chờ nhận', badge: null },
    { icon: Star, label: 'Chờ đánh giá', badge: null },
    { icon: Calendar, label: 'Trả hàng', badge: null },
];

const QUICK_ACTIONS_BOTTOM = [
    { icon: ShoppingCart, label: 'Giỏ hàng', badge: 70 },
    { icon: Tag, label: 'Phiếu giảm giá', badge: 1 },
    { icon: Wallet, label: 'Thưởng', badge: null },
    { icon: Bookmark, label: 'Yêu thích', badge: null },
    { icon: MapPin, label: 'Sổ địa chỉ', badge: null },
    { icon: CreditCard, label: 'TikTok Pay', badge: null },
];

const SUGGESTED_PRODUCTS = [
    {
        id: '1',
        image: 'https://i.imgur.com/dHy2fWw.png',
        title: 'Kệ để máy tính kệ màn hình gỗ...',
        price: 39000,
        originalPrice: 40000,
        badge: 'Deal Ngon Mỗi Ngày',
        rating: 4.5,
        sold: '15.1K',
        tags: ['Trả hàng miễn phí', 'COD'],
        hasVideo: true,
    },
    {
        id: '2',
        image: 'https://i.imgur.com/dHy2fWw.png',
        title: 'Đồ Chơi Đường Hầm Khủng Long, Hầm...',
        price: 260000,
        originalPrice: 300000,
        discount: '-13%',
        shopName: 'Star Shop',
        rating: 4.5,
        sold: '50',
        tags: ['Trả hàng miễn phí', 'COD'],
    },
    {
        id: '3',
        image: 'https://i.imgur.com/dHy2fWw.png',
        title: 'Đồ Chơi Đường Hầm Khủng Long, Hầm...',
        price: 260000,
        originalPrice: 300000,
        discount: '-13%',
        shopName: 'Star Shop',
        rating: 4.5,
        sold: '50',
        tags: ['Trả hàng miễn phí', 'COD'],
    },
    {
        id: '4',
        image: 'https://i.imgur.com/dHy2fWw.png',
        title: 'Đồ Chơi Đường Hầm Khủng Long, Hầm...',
        price: 260000,
        originalPrice: 300000,
        discount: '-13%',
        shopName: 'Star Shop',
        rating: 4.5,
        sold: '50',
        tags: ['Trả hàng miễn phí', 'COD'],
    }
];

export default function OrderManagementScreen() {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { width } = useWindowDimensions();

    // Calculate responsive columns
    const numColumns = useMemo(() => {
        if (width < 600) return 2;
        if (width < 800) return 3;
        return 4;
    }, [width]);

    const renderProductItem = ({ item, index }: { item: any; index: number }) => <ProductCard numCols={numColumns} item={item} index={index} />;

    return (
        <View style={styles.container}>
            <StatusBarCustom />
            {/* Header */}
            <HeaderNavigate
                title="Đơn hàng của bạn"
                itemRight={
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.iconButton}>
                            <HelpCircle size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <MessageCircle size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                }
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Order Status Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>Xem tất cả {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlexBox gap={8}>
                        {/* Top Quick Actions */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.actionsScrollContent}
                        >
                            {QUICK_ACTIONS_TOP.map((action, index) => (
                                <QuickAction
                                    key={index}
                                    icon={action.icon}
                                    label={action.label}
                                    badge={action.badge}
                                />
                            ))}
                        </ScrollView>

                    </FlexBox>
                </View>
                <Separator height={4} />
                <View style={styles.section}>
                    {/* Bottom Quick Actions */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionsScrollContent}
                    >
                        {QUICK_ACTIONS_BOTTOM.map((action, index) => (
                            <QuickAction
                                key={index}
                                icon={action.icon}
                                label={action.label}
                                badge={action.badge}
                            />
                        ))}
                    </ScrollView>
                </View>
                {/* Suggested Products */}
                <View style={styles.suggestedProducts}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Có thể bạn cũng thích</Text>
                    </View>
                    <MasonryFlashList
                        data={SUGGESTED_PRODUCTS}
                        numColumns={numColumns}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.id}
                        estimatedItemSize={300}
                        contentContainerStyle={styles.productsListContent}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 4,
    },
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: colors.background,
    },
    suggestedProducts: {
        marginTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    viewAll: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    actionsRow: {
        marginBottom: 16,
    },
    actionsScrollContent: {
        paddingHorizontal: 16,
        gap: 4,
        paddingVertical: 16,
    },
    productsListContent: {
        paddingTop: 12,
        paddingHorizontal: 8,
    },
    productCard: {
        backgroundColor: colors.background,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 8,
    },
    productImageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
    },
    productImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.surface,
    },
    videoIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    videoTime: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '600',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: 'bold',
    },
    dealBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    dealBadgeText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: '600',
    },
    productInfo: {
        padding: 8,
    },
    shopBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    shopBadgeText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    productTitle: {
        fontSize: 13,
        color: colors.text,
        lineHeight: 18,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.primary,
    },
    originalPrice: {
        fontSize: 12,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 4,
    },
    tag: {
        backgroundColor: colors.successLight,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2,
    },
    tagText: {
        fontSize: 9,
        color: colors.successDark,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rating: {
        fontSize: 11,
        color: colors.text,
    },
    sold: {
        fontSize: 11,
        color: colors.textSecondary,
    },
});

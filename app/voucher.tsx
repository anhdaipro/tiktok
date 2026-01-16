import { MyVoucherHeader } from '@/components/voucher/my-voucher-header';
import { ProductVoucherListItem } from '@/components/voucher/product-voucher-list-item';
import { VoucherCard } from '@/components/voucher/voucher-card';
import { VoucherXtraCard } from '@/components/voucher/voucher-xtra-card';
import { VoucherXtraSection } from '@/components/voucher/voucher-xtra-section';
import { useTheme } from '@/contexts/theme-context';
import { ChevronDown, ChevronLeft, ShoppingCart } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const VOUCHER_XTRA_DATA = [
    {
        id: '1',
        tag: 'Quy đổi giờ hạn',
        source: 'Từ TikTok Shop',
        title: 'Giảm 20%',
        description: 'cho đơn trên 79K đ',
    },
    {
        id: '2',
        tag: 'Quy đổi giờ hạn',
        source: 'Từ TikTok Shop',
        title: 'Giảm 25%',
        description: 'cho đơn trên 79K đ',
    },
];

const EXCLUSIVE_VOUCHERS = [
    {
        id: '1',
        tag: 'Quy đổi giờ hạn',
        source: 'Từ TikTok Shop',
        title: 'Giảm 20%',
        description: 'cho đơn trên 79K đ',
        validUntil: 'Áp dụng trong 1 ngày từ khi lấy mã',
    },
    {
        id: '2',
        tag: 'Quy đổi giờ hạn',
        source: 'Từ TikTok Shop',
        title: 'Giảm 25%',
        description: 'cho đơn trên 79K đ',
        validUntil: 'Áp dụng trong 1 ngày từ khi lấy mã',
    },
    {
        id: '3',
        tag: 'Quy đổi giờ hạn',
        source: 'Từ TikTok Shop',
        title: 'Giảm 20%',
        description: 'cho đơn trên 79K đ',
        validUntil: 'Áp dụng từ 28/12/2025 - 30/12/2025',
    },
];

const PRODUCT_VOUCHERS = [
    {
        id: '1',
        storeName: 'Tổng Kho Tai Nghe',
        productImage: 'https://i.imgur.com/3Y2mYnm.png',
        productName: 'Tai nghe PRO GEN 6, tai nghe bluetooth full tính nă...',
        currentPrice: 2000000,
        originalPrice: undefined,
        discount: 'Giảm 367,6K đ',
        minSpend: 'Không mức chi tiêu tối thiểu',
        unavailable: true,
    },
    {
        id: '2',
        storeName: 'TabletPlaza',
        productImage: 'https://i.imgur.com/2Y5lw0A.png',
        productName: 'Điện ThoạiXiaomi Redmi Note 14 8GB 128GB',
        currentPrice: 4490000,
        originalPrice: 4990000,
        discount: 'Giảm 500K đ',
        minSpend: 'cho đơn trên 3000K',
        unavailable: false,
    },
    {
        id: '3',
        storeName: 'Xiaomi Store Việt Nam',
        productImage: 'https://i.imgur.com/gB44t2D.png',
        productName: 'Điện Thoại Xiaomi Redmi Note 14 6GB/128GB - Qu...',
        currentPrice: 3519000,
        originalPrice: 5990000,
        discount: 'Giảm 600K đ',
        minSpend: 'cho đơn trên 3000K đ',
        unavailable: false,
    },
    {
        id: '4',
        storeName: 'NGUYEN NHU NHAN',
        productImage: 'https://i.imgur.com/Yf2aG4A.png',
        productName: '[Combo 3] Giá đỡ Điện thoại để Bàn có thể Xoay...',
        currentPrice: 21800,
        originalPrice: 62286,
        discount: 'Giảm 30%',
        minSpend: 'Không mức chi tiêu tối thiểu',
        unavailable: false,
    },
    {
        id: '5',
        storeName: 'Milife',
        productImage: 'https://i.imgur.com/3Y2mYnm.png',
        productName: 'Điện Thoại Xiaomi Redmi Note 14 8GB 128GB Chín...',
        currentPrice: 4690000,
        originalPrice: 6490000,
        discount: 'Giảm 2K đ',
        minSpend: 'Không mức chi tiêu tối thiểu',
        unavailable: false,
    },
    {
        id: '6',
        storeName: 'Happy Phone Mall',
        productImage: 'https://i.imgur.com/2Y5lw0A.png',
        productName: 'Điện thoại Samsung Galaxy A56 5G - Hàng C...',
        currentPrice: 7845000,
        originalPrice: undefined,
        discount: 'Giảm 1,45Tr đ',
        minSpend: 'Không mức chi tiêu tối thiểu',
        unavailable: false,
    },
];

const VoucherScreen = () => {
    const { colors } = useTheme();
    const [showAllExclusive, setShowAllExclusive] = useState(false);

    const displayedVouchers = showAllExclusive
        ? EXCLUSIVE_VOUCHERS
        : EXCLUSIVE_VOUCHERS.slice(0, 3);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Trung tâm voucher
                </Text>
                <TouchableOpacity style={styles.cartButton}>
                    <ShoppingCart size={24} color={colors.text} />
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>70</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* My Voucher Section */}
                <MyVoucherHeader count={1} />

                {/* Voucher Xtra Section with Cards */}
                <VoucherXtraSection>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.xtraCardsContainer}
                    >
                        {VOUCHER_XTRA_DATA.map((voucher) => (
                            <VoucherXtraCard
                                key={voucher.id}
                                tag={voucher.tag}
                                source={voucher.source}
                                title={voucher.title}
                                description={voucher.description}
                            />
                        ))}
                    </ScrollView>
                </VoucherXtraSection>

                {/* Exclusive Vouchers Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Voucher độc quyền (20)
                    </Text>
                    <TouchableOpacity style={styles.receiveAllButton}>
                        <Text style={styles.receiveAllButtonText}>Nhận hết</Text>
                    </TouchableOpacity>
                </View>

                {displayedVouchers.map((voucher) => (
                    <VoucherCard
                        key={voucher.id}
                        tag={voucher.tag}
                        source={voucher.source}
                        title={voucher.title}
                        description={voucher.description}
                        validUntil={voucher.validUntil}
                        variant="default"
                    />
                ))}

                {/* Show More Button */}
                <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowAllExclusive(!showAllExclusive)}
                >
                    <Text style={[styles.showMoreText, { color: colors.text }]}>
                        {showAllExclusive ? 'Thu gọn' : 'Xem tất cả voucher'}
                    </Text>
                    <ChevronDown
                        size={16}
                        color={colors.text}
                        style={{
                            transform: [{ rotate: showAllExclusive ? '180deg' : '0deg' }],
                        }}
                    />
                </TouchableOpacity>

                {/* Product Vouchers Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Voucher tuyệt vời khác
                    </Text>
                </View>

                {PRODUCT_VOUCHERS.map((product) => (
                    <ProductVoucherListItem
                        key={product.id}
                        storeName={product.storeName}
                        productImage={product.productImage}
                        productName={product.productName}
                        currentPrice={product.currentPrice}
                        originalPrice={product.originalPrice}
                        discount={product.discount}
                        minSpend={product.minSpend}
                        unavailable={product.unavailable}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    cartButton: {
        padding: 4,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF2D55',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    xtraCardsContainer: {
        paddingRight: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    receiveAllButton: {
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    receiveAllButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 24,
        gap: 4,
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '500',
    },
    productCardsContainer: {
        paddingRight: 16,
    },
});

export default VoucherScreen;

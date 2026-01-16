import AdvancedFPSDisplay from '@/components/advanced-fps-display';
import { BannerSlider } from '@/components/shop/banner-slider';
import { FlashSale } from '@/components/shop/FlashSale';
import { ProductCard } from '@/components/shop/product-card';
import { QuickLinks } from '@/components/shop/quick-links';
import { ServiceBanners } from '@/components/shop/service-banners';
import { ShopHeader } from '@/components/shop/ShopHeader';
import StatusBarCustom from '@/components/ui/status-bar';
import { Wheel } from '@/components/wheel/wheel';
import { useTheme } from '@/contexts/theme-context';
import { MasonryFlashList } from '@shopify/flash-list';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

// Mock Data
const MOCK_CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'mall', name: 'Mall', isBrand: true },
  { id: '1212', name: '12.12', isEvent: true },
  { id: 'extra', name: 'Extra Đặc Biệt' },
  { id: 'men-fashion', name: 'Quần áo nam' },
  { id: 'women-fashion', name: 'Quần áo nữ' },
];

const MOCK_PRODUCTS = [
  {
    _id: '1',
    title: 'KỆ MÁY TÍNH ĐỂ BÀN LÀM VIỆC ĐA NĂNG',
    image: 'https://i.imgur.com/3Y2mYnm.png',
    price: 35000,
    originalPrice: 45000,
    sold: 2231,
    rating: 4.7,
    discount: '-22%',
    extraTag: 'XTRA Freeship',
    cod: true,
  },
  {
    _id: '2',
    title: 'Star Shop Giá đỡ Điện thoại Máy tính Bảng iPad',
    image: 'https://i.imgur.com/2Y5lw0A.png',
    price: 20900,
    originalPrice: 35000,
    sold: 1500,
    rating: 4.7,
    discount: '-40%',
    extraTag: 'XTRA Freeship',
    cod: true,
  },
  {
    _id: '3',
    title: 'Tai nghe không dây Bluetooth',
    image: 'https://i.imgur.com/gB44t2D.png',
    price: 99000,
    sold: 5000,
    rating: 4.9,
    discount: '-50%',
    cod: true,
  },
  {
    _id: '4',
    title: 'Bàn phím cơ không dây nhỏ gọn',
    image: 'https://i.imgur.com/Yf2aG4A.png',
    price: 450000,
    originalPrice: 600000,
    sold: 890,
    rating: 4.8,
    discount: '-25%',
    extraTag: 'Mall',
    cod: true,
  },
];
export const PADDING = 12;
const ShopScreen = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  // Calculate responsive columns
  const numColumns = useMemo(() => {
    if (width < 600) return 2;
    if (width < 800) return 3;
    return 4;
  }, [width]);

  const renderProductItem = ({ item, index }: { item: any; index: number }) => (
    <ProductCard numCols={numColumns} item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <AdvancedFPSDisplay />
      <StatusBarCustom />
      <ShopHeader />
      <MasonryFlashList
        data={MOCK_PRODUCTS}
        numColumns={numColumns}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        estimatedItemSize={250}
        contentContainerStyle={styles.gridContainer}
        ListHeaderComponent={
          <>
            {/* Quick Links - Icon Grid Navigation */}
            <QuickLinks />

            {/* Banner Slider with Dots */}
            <BannerSlider />

            {/* Service Banners - Feature Cards */}
            <ServiceBanners />

            {/* Flash Sale Section */}
            <FlashSale />
            <Wheel />

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled
              contentContainerStyle={styles.tabsContainer}
            >
              {MOCK_CATEGORIES.map((cat, index) => (
                <View key={cat.id} style={[styles.tab, index === 0 && styles.activeTab]}>
                  <Text style={[styles.tabText, index === 0 && styles.activeTabText]}>
                    {cat.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        }
      />
    </View>
  );
};

const createThemedStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    gridContainer: {
      paddingHorizontal: PADDING
    },
    tabsContainer: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
    activeTab: { borderBottomWidth: 2, borderColor: colors.text },
    tabText: { color: colors.textSecondary, fontWeight: '500' },
    activeTabText: { color: colors.text, fontWeight: 'bold' },
  });

export default ShopScreen;

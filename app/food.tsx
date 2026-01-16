import { CartIcon } from '@/components/common/cart-icon';
import { ActionButtons } from '@/components/food/action-buttons';
import { CategoryScroll, FoodCategory } from '@/components/food/category-scroll';
import { CurvedTabSwitcher } from '@/components/food/curved-tab-switcher';
import { LocationHeader } from '@/components/food/location-header';
import { PromoBanner } from '@/components/food/promo-banner';
import { Restaurant, RestaurantCard } from '@/components/food/restaurant-card';
import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

type TabType = 'delivery' | 'dine-in';

export default function FoodScreen() {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [activeTab, setActiveTab] = useState<TabType>('delivery');
    const [searchQuery, setSearchQuery] = useState('');

    // Sample data
    const categories: FoodCategory[] = [
        {
            id: '1',
            name: 'Cà Phê - Trà',
            image: require('@/assets/images/react-logo.png'),
        },
        {
            id: '2',
            name: 'Trà Sữa',
            image: require('@/assets/images/react-logo.png'),
        },
        {
            id: '3',
            name: 'Nước Ép - Sinh Tố',
            image: require('@/assets/images/react-logo.png'),
        },
        { id: '4', name: 'Cơm', image: require('@/assets/images/react-logo.png') },
        {
            id: '5',
            name: 'Bún - Phở - Cháo',
            image: require('@/assets/images/react-logo.png'),
        },
        {
            id: '6',
            name: 'Lẩu - Nướng',
            image: require('@/assets/images/react-logo.png'),
        },
    ];

    const restaurants: Restaurant[] = [
        {
            id: '1',
            name: 'ẢNG-Ê COFFEE',
            image: require('@/assets/images/react-logo.png'),
            rating: 4.8,
            reviewCount: 447,
            distance: '87.7km',
            hasDelivery: true,
            badge: 'MỚI',
            verified: true,
        },
        {
            id: '2',
            name: 'Bún Cá Lóc Phạm Ngọc Thạch',
            image: require('@/assets/images/react-logo.png'),
            rating: 4.7,
            reviewCount: 402,
            distance: '87.8km',
            hasDineIn: true,
            badge: 'GIẢM',
            verified: true,
        },
        {
            id: '3',
            name: 'RAU MÃ',
            image: require('@/assets/images/react-logo.png'),
            rating: 4.7,
            reviewCount: 320,
            distance: '89.4km',
            hasDelivery: true,
            hasDineIn: true,
        },
    ];

    return (
        <View style={styles.container}>
            {/* Location Header */}
            <LocationHeader
                location="Tân Phú, Đông Xoài, Bình Phước"
                onBackPress={() => router.back()}
                onLocationPress={() => console.log('Location press')}
                onFavoritePress={() => console.log('Favorite press')}
                onCartPress={() => console.log('Cart press')}
                onHomePress={() => console.log('Home press')}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Promo Banner */}
                <PromoBanner
                    onPress={() => console.log('Promo press')}
                    imageSource={require('@/assets/images/react-logo.png')}
                />

                {/* Curved Tab Switcher */}
                <CurvedTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={colors.textSecondary}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Cà phê,"
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <CartIcon />
                </View>

                {/* Category Scroll */}
                <CategoryScroll
                    categories={categories}
                    onCategoryPress={(cat) => console.log('Category:', cat.name)}
                />

                {/* Action Buttons */}
                <ActionButtons
                    onOrderPress={() => console.log('Order press')}
                    onReservePress={() => console.log('Reserve press')}
                />

                {/* Promotional Section */}
                <View style={styles.promoSection}>
                    <Text style={styles.promoTitle}>Thêm tô có</Text>
                    <Text style={styles.promoSubtitle}>Đặt giao món ngay</Text>
                </View>

                {/* Restaurant Cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.restaurantList}
                >
                    {restaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onPress={(r) => console.log('Restaurant:', r.name)}
                        />
                    ))}
                </ScrollView>

                {/* Bottom Navigation Placeholder */}
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingBottom: 80,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            gap: 12,
            marginBottom: 8,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 25,
            paddingHorizontal: 16,
            height: 48,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            color: colors.text,
        },
        promoSection: {
            padding: 16,
            marginTop: 8,
        },
        promoTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
        },
        promoSubtitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FE2C55',
            fontStyle: 'italic',
        },
        restaurantList: {
            paddingHorizontal: 16,
            gap: 12,
        },
        bottomSpacer: {
            height: 20,
        },
    });

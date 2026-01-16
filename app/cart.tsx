import CartFooter from '@/components/cart/cart-footer';
import ShopGroup, { ShopGroupType } from '@/components/cart/shop-group';
import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useCartStore } from '@/stores/use-cart-store';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();

  // Zustand store hooks
  const shops = useCartStore((state) => state.shops);
  const toggleShop = useCartStore((state) => state.toggleShop);
  const toggleAll = useCartStore((state) => state.toggleAll);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getSelectedShops = useCartStore((state) => state.getSelectedShops);
  const isAllSelected = useCartStore((state) => state.isAllSelected);

  const handleCheckout = () => {
    const selectedShops = getSelectedShops();

    if (selectedShops.length === 0) {
      return;
    }

    router.push({
      pathname: '/checkout',
      params: { data: JSON.stringify(selectedShops) },
    });
  };

  // --- Calculated Values ---
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const allSelected = isAllSelected();

  const renderItem = useCallback(({ item }: { item: ShopGroupType }) => (
    <ShopGroup shop={item} onToggleShop={toggleShop} />
  ), [toggleShop]); // ✅ Thêm dependency

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <FlexBox direction="row" align="center" justify="space-between" style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ChevronLeft size={24} color={Colors.gray800} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng ({totalItems})</Text>
          <TouchableOpacity>
            <Text style={styles.editText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </FlexBox>

        <FlexBox direction="row" align="center" justify="center" gap={4} style={styles.locationBar}>
          <MapPin size={12} color={Colors.gray500} />
          <Text style={styles.locationText} numberOfLines={1}>
            Phường 17, Bình Thạnh, Hồ Chí Minh
          </Text>
          <Text style={{ fontSize: 10, color: Colors.gray500 }}>{'>'}</Text>
        </FlexBox>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* List */}
        <FlatList
          data={shops}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {/* Footer */}
      <CartFooter
        totalPrice={totalPrice}
        isAllSelected={allSelected}
        onToggleAll={toggleAll}
        onCheckout={handleCheckout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100, // Nền xám nhạt cho toàn màn hình
  },
  header: {
    backgroundColor: Colors.light.background,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTop: {
    paddingHorizontal: 12,
    height: 44,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray800,
  },
  editText: {
    fontSize: 14,
    color: Colors.gray800,
  },
  locationBar: {
    marginTop: 4,
    paddingHorizontal: 40
  },
  locationText: {
    fontSize: 12,
    color: Colors.gray500,
    maxWidth: '80%'
  },
  listContent: {
    padding: 12,
  },

});

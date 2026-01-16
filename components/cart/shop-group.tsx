import FlexBox from '@/components/common/flex-box';
import { Checkbox } from '@/components/ui/checkbox';
import { Colors } from '@/constants/theme';
import { ChevronRight, Store } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem, CartItemType } from './cart-item';

export interface ShopGroupType {
  id: string;
  name: string;
  isMall?: boolean;
  items: CartItemType[];
}

interface ShopGroupProps {
  shop: ShopGroupType;
  onToggleShop: (shopId: string) => void;
}

const ShopGroup: React.FC<ShopGroupProps> = ({
  shop,
  onToggleShop,
}) => {
  // Logic: Shop được chọn nếu tất cả item (còn hàng) được chọn
  const availableItems = shop.items.filter((i) => !i.isOutStock);
  const isShopSelected = availableItems.length > 0 && availableItems.every((i) => i.isSelected);
  console.log('shop', shop.id);

  return (
    <View style={styles.container}>
      {/* Shop Header */}
      <FlexBox direction="row" align="center" gap={12} style={styles.header}>
        <Checkbox checked={isShopSelected} onPress={() => onToggleShop(shop.id)} />
        <FlexBox direction="row" align="center" gap={6} style={{ flex: 1 }}>
          {shop.isMall && (
            <View style={styles.mallBadge}>
              <Text style={styles.mallText}>Mall</Text>
            </View>
          )}
          {!shop.isMall && <Store size={16} color={Colors.gray800} />}
          <Text style={styles.shopName}>{shop.name}</Text>
          <ChevronRight size={16} color={Colors.gray500} />
        </FlexBox>
      </FlexBox>

      {/* Items List */}
      <View style={styles.itemList}>
        {shop.items.map((item, index) => (
          <View key={item.id}>
            <CartItem item={item} />
            {/* Separator */}
            {index < shop.items.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>

      {/* Voucher Hint (Optional based on image) */}
      <TouchableOpacity style={styles.voucherHint}>
        <Text style={styles.voucherText}>Tiết kiệm đến 5.000₫ với voucher</Text>
        <ChevronRight size={14} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};
export default memo(ShopGroup)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    marginBottom: 12,
  },
  mallBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  mallText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  shopName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray800,
  },
  itemList: {

  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginLeft: 32, // Thụt vào thẳng hàng với ảnh
  },
  voucherHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.gray200,
    marginTop: 4
  },
  voucherText: {
    fontSize: 12,
    color: Colors.primary
  }
});

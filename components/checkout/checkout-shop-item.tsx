import FlexBox from '@/components/common/flex-box';
import Separator from '@/components/common/separator';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import { ChevronRight, Info, Store, Ticket } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CheckoutShopItemProps {
  shop: any;
}

export const CheckoutShopItem: React.FC<CheckoutShopItemProps> = ({ shop }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Mock shipping fee calculation (e.g., 30,200 per shop)
  const shippingFee = 30200;

  return (
    <View style={styles.container}>
      {/* Shop Header */}
      <FlexBox direction="row" align="center" gap={8} style={styles.header}>
        {shop.isMall ? (
          <View style={styles.mallBadge}><Text style={styles.mallText}>Mall</Text></View>
        ) : (
          <Store size={16} color={colors.text} />
        )}
        <Text style={styles.shopName}>{shop.name}</Text>
      </FlexBox>

      {/* Product List */}
      {shop.items.map((item: any, index: number) => (
        <FlexBox key={item.id} direction="row" gap={12} style={[styles.productRow, index > 0 && { marginTop: 12 }]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.variantBox}>
              <Text style={styles.variantText}>{item.variant || 'Mặc định'}</Text>
            </View>
            <View style={styles.tagRow}>
              <Text style={styles.returnTag}>Trả hàng miễn phí</Text>
              <Text style={styles.authTag}>Chính hãng 100%</Text>
            </View>
            <FlexBox direction="row" justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Text style={styles.price}>{item.price.toLocaleString()}₫</Text>
              <Text style={styles.quantity}>x{item.quantity}</Text>
            </FlexBox>
          </View>
        </FlexBox>
      ))}


      {/* Note Input */}
      <FlexBox direction="row" justify="space-between" align="center" style={styles.noteRow}>
        <Text style={styles.noteLabel}>Thêm ghi chú</Text>
        <ChevronRight size={16} color={Colors.gray500} />
      </FlexBox>

      <Separator height={0.5} color={colors.border} />

      {/* Shipping */}
      <View style={styles.shippingRow}>
        <FlexBox direction="row" justify="space-between">
          <Text style={styles.shippingTitle}>Đảm bảo giao vào 13-17 tháng 12</Text>
          <Text style={styles.shippingPrice}>{shippingFee.toLocaleString()}₫</Text>
        </FlexBox>
        <Text style={styles.shippingSub}>Vận chuyển tiêu chuẩn</Text>
        <FlexBox direction="row" align="center" gap={4} style={{ marginTop: 4 }}>
          <Text style={styles.shippingVoucher}>Nhận voucher ít nhất 15K₫ nếu đơn giao trễ</Text>
          <Info size={12} color={Colors.gray500} />
        </FlexBox>
      </View>

      <Separator height={0.5} color={colors.border} />

      {/* Shop Voucher */}
      <FlexBox direction="row" justify="space-between" align="center" style={styles.voucherRow}>
        <FlexBox direction="row" align="center" gap={8}>
          <Ticket size={18} color={Colors.primary} />
          <Text style={styles.voucherText}>Giảm giá từ TikTok Shop</Text>
        </FlexBox>
        <ChevronRight size={16} color={Colors.gray500} />
      </FlexBox>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 12,
    marginBottom: 10,
  },
  header: {
    marginBottom: 12,
  },
  mallBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  mallText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  shopName: { fontSize: 14, fontWeight: '600', color: colors.text },
  productRow: { marginBottom: 12 },
  image: { width: 80, height: 80, borderRadius: 4, backgroundColor: colors.backgroundSecondary },
  productName: { fontSize: 13, color: colors.text, marginBottom: 4 },
  variantBox: {
    backgroundColor: colors.backgroundSecondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 4,
  },
  variantText: { fontSize: 11, color: colors.textSecondary },
  tagRow: { flexDirection: 'row', gap: 4 },
  returnTag: { fontSize: 10, color: '#00BFA5', backgroundColor: 'rgba(0, 191, 165, 0.1)', paddingHorizontal: 4 },
  authTag: { fontSize: 10, color: '#FFC107', backgroundColor: 'rgba(255, 193, 7, 0.1)', paddingHorizontal: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  quantity: { fontSize: 14, color: colors.text },
  noteRow: {
    paddingVertical: 12,
  },
  noteLabel: { fontSize: 13, color: colors.text },
  shippingRow: {
    paddingVertical: 12,
  },
  shippingTitle: { fontSize: 13, fontWeight: '500', color: colors.text },
  shippingPrice: { fontSize: 13, fontWeight: '500', color: colors.text },
  shippingSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  shippingVoucher: { fontSize: 11, color: colors.textSecondary },
  voucherRow: {
    paddingTop: 12,
  },
  voucherText: { fontSize: 13, color: colors.text },
});
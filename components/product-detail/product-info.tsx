import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, ShieldCheck, Star, Truck } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ProductInfo = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Vouchers */}
      <TouchableOpacity style={styles.voucherRow}>
        <FlexBox direction="row" gap={8} style={{flex: 1}}>
            <View style={styles.voucherTag}><Text style={styles.voucherText}>Mua 200K đ giảm 10%</Text></View>
            <View style={styles.voucherTag}><Text style={styles.voucherText}>Tiết kiệm 8% với thưởng</Text></View>
        </FlexBox>
        <ChevronRight size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.titleSection}>
        <View style={styles.mallBadge}><Text style={styles.mallText}>12.12</Text></View>
        <Text style={styles.productName} numberOfLines={2}>
            Star Shop Combo 5 Gói Mì Trộn ABC Vị Gà Cay Phô Mai 80gram
        </Text>
      </View>

      {/* Rating */}
      <FlexBox direction="row" align="center" gap={8} style={styles.ratingRow}>
        <Star size={12} color={colors.yellow} fill={colors.yellow} />
        <Text style={styles.ratingText}>4.5 (174)</Text>
        <View style={styles.divider} />
        <Text style={styles.soldText}>Đã bán 3627</Text>
      </FlexBox>

      {/* Shipping */}
      <View style={styles.shippingSection}>
        <FlexBox direction="row" gap={8} style={{marginBottom: 12}}>
            <Truck size={16} color={colors.text} />
            <View style={{flex: 1}}>
                <Text style={styles.shippingTitle}>Đảm bảo giao vào 12 - 14 tháng 12</Text>
                <Text style={styles.shippingSubtitle}>Nhận voucher ít nhất 15K₫ nếu đơn giao trễ</Text>
                <Text style={styles.shippingPrice}>Phí vận chuyển: 29.700₫</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
        </FlexBox>

        <FlexBox direction="row" gap={8} align="center">
            <ShieldCheck size={16} color={colors.text} />
            <Text style={styles.shippingTitle}>Thanh toán khi giao · Trả hàng miễn phí trong 6 ngày</Text>
            <ChevronRight size={16} color={colors.textSecondary} style={{marginLeft: 'auto'}} />
        </FlexBox>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.voucherBackground, // Light pinkish bg
    padding: 8,
    borderRadius: 4,
  },
  voucherTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.voucherBorder,
  },
  voucherText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '500',
  },
  titleSection: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  mallBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 2,
  },
  mallText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  ratingRow: {
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: colors.border,
  },
  soldText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  shippingSection: {
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  shippingTitle: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },
  shippingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  shippingPrice: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  }
});
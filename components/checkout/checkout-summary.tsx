import FlexBox from '@/components/common/flex-box';
import Separator from '@/components/common/separator';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CheckoutSummary = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expandProduct, setExpandProduct] = useState(true);
  const [expandShipping, setExpandShipping] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tóm tắt yêu cầu</Text>

      {/* Product Subtotal */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setExpandProduct(!expandProduct)}
        activeOpacity={0.7}
      >
        <FlexBox direction="row" align="center" gap={4}>
            <Text style={styles.sectionTitle}>Tổng phụ sản phẩm</Text>
            {expandProduct ? <ChevronUp size={16} color={colors.text} /> : <ChevronDown size={16} color={colors.text} />}
        </FlexBox>
        <Text style={styles.sectionValue}>8.760.373₫</Text>
      </TouchableOpacity>
      
      {expandProduct && (
        <View style={styles.detailsContainer}>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Giá gốc</Text>
                <Text style={styles.value}>12.490.000₫</Text>
            </FlexBox>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Giảm giá sản phẩm</Text>
                <Text style={styles.discountValue}>- 3.249.627₫</Text>
            </FlexBox>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Voucher người bán</Text>
                <Text style={styles.discountValue}>- 50.000₫</Text>
            </FlexBox>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Voucher TikTok Shop</Text>
                <Text style={styles.discountValue}>- 430.000₫</Text>
            </FlexBox>
        </View>
      )}

      <Separator height={0.5} color={colors.border} style={{ marginVertical: 12 }} />

      {/* Shipping Subtotal */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setExpandShipping(!expandShipping)}
        activeOpacity={0.7}
      >
        <FlexBox direction="row" align="center" gap={4}>
            <Text style={styles.sectionTitle}>Tổng phụ vận chuyển</Text>
            {expandShipping ? <ChevronUp size={16} color={colors.text} /> : <ChevronDown size={16} color={colors.text} />}
        </FlexBox>
        <Text style={styles.sectionValue}>914.900₫</Text>
      </TouchableOpacity>

      {expandShipping && (
        <View style={styles.detailsContainer}>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Phí vận chuyển</Text>
                <Text style={styles.value}>939.900₫</Text>
            </FlexBox>
            <FlexBox direction="row" justify="space-between" style={styles.row}>
                <Text style={styles.label}>Giảm phí vận chuyển</Text>
                <Text style={styles.discountValue}>- 25.000₫</Text>
            </FlexBox>
        </View>
      )}

      <Separator height={0.5} color={colors.border} style={{ marginVertical: 12 }} />

      {/* Total */}
      <FlexBox direction="row" justify="space-between" align="center">
        <Text style={styles.totalLabel}>Tổng</Text>
        <Text style={styles.totalValue}>9.675.273₫</Text>
      </FlexBox>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  sectionValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  detailsContainer: { marginTop: 4, gap: 8 },
  row: { marginBottom: 4 },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 13, color: colors.text },
  discountValue: { fontSize: 13, color: Colors.primary },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: colors.text },
});
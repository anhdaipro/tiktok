import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CheckoutFooterProps {
  total: number;
  savings: number;
  onPlaceOrder: () => void;
}

export const CheckoutFooter: React.FC<CheckoutFooterProps> = ({ total, savings, onPlaceOrder }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <FlexBox direction="row" justify="space-between" align="center">
        <View>
          <FlexBox direction="row" align="center" gap={4}>
            <Text style={styles.totalLabel}>Tổng (1 mặt hàng)</Text>
          </FlexBox>
          <Text style={styles.totalPrice}>{total.toLocaleString()}₫</Text>
          <Text style={styles.savings}>Tiết kiệm {savings.toLocaleString()}%</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onPlaceOrder}>
          <Text style={styles.buttonText}>Đặt hàng</Text>
          <Text style={styles.buttonSubText}>Ưu đãi sắp kết thúc</Text>
        </TouchableOpacity>
      </FlexBox>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginVertical: 2 },
  savings: { fontSize: 12, color: Colors.primary },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonSubText: { color: 'rgba(255,255,255,0.9)', fontSize: 10 },
});
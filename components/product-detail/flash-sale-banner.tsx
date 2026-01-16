import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Zap } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const FlashSaleBanner = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
        <View style={styles.leftContent}>
            <View style={styles.priceRow}>
                <Text style={styles.discountBadge}>-1%</Text>
                <Text style={styles.price}>57.420₫</Text>
            </View>
            <Text style={styles.originalPrice}>58.000₫</Text>
        </View>
        
        <View style={styles.rightContent}>
            <FlexBox direction="row" align="center" gap={4}>
                <Zap size={16} color={colors.white} fill={colors.white} />
                <Text style={styles.flashSaleText}>Flash Sale</Text>
            </FlexBox>
            <Text style={styles.timerText}>Kết thúc sau 02:24:31</Text>
        </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    backgroundColor: colors.white,
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  price: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  originalPrice: {
    color: Colors.static.white80,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 2,
  },
  flashSaleText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  timerText: {
    color: colors.white,
    fontSize: 12,
  }
});
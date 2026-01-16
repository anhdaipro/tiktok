import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { Minus, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FlexBox direction="row" justify="space-between" align="center" style={styles.quantitySection}>
      <Text style={styles.sectionTitle}>Số lượng</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
          <Minus size={16} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
          <Plus size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </FlexBox>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    quantitySection: {
      marginBottom: 40,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
    },
    qtyBtn: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    qtyValue: {
      width: 40,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
  });

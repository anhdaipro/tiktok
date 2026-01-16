import { useTheme } from '@/contexts/theme-context';
import { X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VariantHeaderProps {
  image: string;
  price: string;
  originalPrice: string;
  stock: number;
  onClose: () => void;
}

export const VariantHeader: React.FC<VariantHeaderProps> = ({
  image,
  price,
  originalPrice,
  stock,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <View style={styles.productInfo}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: image }} style={styles.productImage} />
        </View>
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text style={styles.discountBadge}>-47%</Text>
            <Text style={styles.price}>{price}</Text>
          </View>
          <Text style={styles.originalPrice}>{originalPrice}</Text>
          <Text style={styles.stockText}>Kho: {stock}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <X size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    productInfo: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-end',
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: 4,
      backgroundColor: colors.backgroundSecondary,
    },
    priceInfo: {
      gap: 4,
      paddingBottom: 4,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    discountBadge: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 4,
      borderRadius: 2,
    },
    price: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    originalPrice: {
      fontSize: 14,
      color: colors.textSecondary,
      textDecorationLine: 'line-through',
    },
    stockText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    closeBtn: {
      padding: 4,
    },
  });

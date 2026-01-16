import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Size</Text>
      <View style={styles.sizeGrid}>
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <TouchableOpacity
              key={size}
              style={[styles.sizeItem, isSelected && styles.sizeItemSelected]}
              onPress={() => onSelect(size)}
            >
              <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
                {size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 4,
    },
    sizeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    sizeItem: {
      minWidth: 40,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 12,
    },
    sizeItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.background,
    },
    sizeText: {
      fontSize: 13,
      color: colors.text,
    },
    sizeTextSelected: {
      color: colors.primary,
      fontWeight: '500',
    },
  });

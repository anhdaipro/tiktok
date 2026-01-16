import { useTheme } from '@/contexts/theme-context';
import { Image } from "expo-image";
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface VariantItem {
  id: string;
  name: string;
  image: string;
}

interface VariantSelectorProps {
  variants: VariantItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedId,
  onSelect,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      <Text style={styles.sectionTitle}>Mẫu</Text>
      <View style={styles.variantGrid}>
        {variants.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.variantItem, isSelected && styles.variantItemSelected]}
              onPress={() => onSelect(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.variantImage} />
              <Text style={[styles.variantText, isSelected && styles.variantTextSelected]}>
                {item.name}
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
    variantGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    variantItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
      gap: 8,
      minWidth: '40%',
    },
    variantItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.background,
    },
    variantImage: {
      width: 24,
      height: 24,
      borderRadius: 2,
    },
    variantText: {
      fontSize: 13,
      color: colors.text,
    },
    variantTextSelected: {
      color: colors.primary,
      fontWeight: '500',
    },
  });

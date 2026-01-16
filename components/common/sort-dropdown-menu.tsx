import { useTheme } from '@/contexts/theme-context';
import { Check } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SortByType = 'top' | 'newest';

interface SortDropdownMenuProps {
  onSelectSort: (type: SortByType) => void;
  currentSortBy: SortByType;
  onClose: () => void;
  position: { top: number; right: number };
}

export const SortDropdownMenu: React.FC<SortDropdownMenuProps> = ({
  onSelectSort,
  currentSortBy,
  onClose,
  position,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePressSort = (type: SortByType) => {
    onSelectSort(type);
    onClose(); // Đóng modal sau khi chọn
  };

  return (
    <View style={[styles.dropdownMenu, position]}>
      <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePressSort('top')}>
        <Text style={styles.dropdownText}>Hàng đầu</Text>
        {currentSortBy === 'top' && <Check size={18} color={colors.primary} />}
      </TouchableOpacity>
      <View style={styles.dropdownSeparator} />
      <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePressSort('newest')}>
        <Text style={styles.dropdownText}>Mới nhất</Text>
        {currentSortBy === 'newest' && <Check size={18} color={colors.primary} />}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    dropdownMenu: {
      position: 'absolute',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingVertical: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: 150,
    },
    dropdownText: {
      color: colors.text,
      fontSize: 16,
    },
    dropdownSeparator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
  });
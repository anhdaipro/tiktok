import { useTheme } from '@/contexts/theme-context';
import { Check } from 'lucide-react-native';
import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface DropMenuOption {
  label: string;
  value: string | number;
  icon?: ReactNode; // Icon tùy chọn cho mỗi mục
}

interface DropMenuProps {
  options: DropMenuOption[];
  onSelect: (option: DropMenuOption) => void;
  selectedValue?: string | number; // Giá trị đang được chọn để hiển thị dấu check
  onClose: () => void;
  position: { top: number; right: number };
}

export const DropMenu: React.FC<DropMenuProps> = ({
  options,
  onSelect,
  selectedValue,
  onClose,
  position,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePress = (option: DropMenuOption) => {
    onSelect(option);
    onClose(); // Tự động đóng modal sau khi chọn
  };

  return (
    <View style={[styles.dropdownMenu, position]}>
      {options.map((option, index) => (
        <React.Fragment key={option.value}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePress(option)}>
            {option.icon}
            <Text style={[styles.dropdownText, option.icon ? { marginLeft: 8 } : {}]}>{option.label}</Text>
            {selectedValue === option.value && <Check size={18} color={colors.primary} />}
          </TouchableOpacity>
          {index < options.length - 1 && <View style={styles.dropdownSeparator} />}
        </React.Fragment>
      ))}
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
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: 150,
    },
    dropdownText: {
      flex: 1, // Để text chiếm hết không gian còn lại
      color: colors.text,
      fontSize: 16,
    },
    dropdownSeparator: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
  });
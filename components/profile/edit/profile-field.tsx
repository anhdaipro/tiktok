import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, Copy } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ProfileFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  isCopy?: boolean; // Nếu là link copy
  rightIcon?: React.ReactNode; // Icon tùy chỉnh bên phải
}

export const ProfileField = ({ label, value, placeholder, onPress, isCopy, rightIcon }: ProfileFieldProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <FlexBox direction="row" justify="space-between" align="center" style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        
        <FlexBox direction="row" align="center" gap={8} style={styles.valueContainer}>
          <Text 
            style={[styles.value, !value && styles.placeholder]} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {value || placeholder}
          </Text>
          
          {rightIcon ? (
            rightIcon
          ) : isCopy ? (
            <Copy size={16} color={colors.text} />
          ) : (
            <ChevronRight size={20} color={colors.textSecondary} />
          )}
        </FlexBox>
      </FlexBox>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    width: 100, // Cố định chiều rộng label để thẳng hàng
  },
  valueContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    maxWidth: '90%',
  },
  placeholder: {
    color: colors.textSecondary,
    fontWeight: '400',
  },
});
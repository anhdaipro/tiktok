import { Colors } from '@/constants/theme';
import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  size = 20,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: checked ? Colors.primary : Colors.gray300,
          backgroundColor: checked ? Colors.primary : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {checked && <Check size={size * 0.7} color="#FFF" strokeWidth={3} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { Colors } from '@/constants/theme';
import { Minus, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange?: (value: number) => void; // Callback khi nhập từ bàn phím
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Sync input với prop quantity khi thay đổi từ bên ngoài (nút +/-)
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleChangeText = (text: string) => {
    // Chỉ cho phép nhập số
    if (text === '' || /^\d+$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);

    // Validate và áp dụng min/max
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange?.(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange?.(max);
    } else {
      setInputValue(numValue.toString());
      onChange?.(numValue);
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TouchableOpacity onPress={onDecrease} style={styles.btn} disabled={disabled}>
        <Minus size={14} color={Colors.gray500} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        keyboardType="numeric"
        editable={!disabled}
        textAlign="center"
        selectTextOnFocus
      />
      <TouchableOpacity onPress={onIncrease} style={styles.btn} disabled={disabled}>
        <Plus size={14} color={Colors.gray500} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 4,
    height: 24,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: Colors.gray100,
  },
  btn: {
    width: 24,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',

  },
  input: {
    width: 32,
    height: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.gray200,
    fontSize: 12,
    color: Colors.gray800,
    padding: 0,
  },
});

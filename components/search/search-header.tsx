import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchHeaderProps {
  initialQuery?: string;
  onSearch?: (text: string) => void;
  onChangeText?: (text: string) => void;
}

export const SearchHeader = ({ initialQuery = '', onSearch, onChangeText }: SearchHeaderProps) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState(initialQuery);

  const handleClear = () => {
    setQuery('');
    onChangeText?.('');
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    onChangeText?.(text);
  };

  return (
    <FlexBox direction="row" align="center" gap={12} style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="tìm hiểu nhật bản"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleChangeText}
          autoFocus={false}
        />
        {query ? (
          <TouchableOpacity onPress={handleClear}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : (
           <Camera size={20} color={colors.textSecondary} />
        )}
      </View>

      <TouchableOpacity onPress={() => onSearch?.(query)}>
        <Text style={styles.searchText}>Tìm kiếm</Text>
      </TouchableOpacity>
    </FlexBox>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary || '#F1F1F2',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
    height: '100%',
  },
  searchText: {
    color: '#FE2C55',
    fontWeight: '600',
    fontSize: 15,
  },
});
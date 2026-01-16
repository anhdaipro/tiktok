import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { Camera, Search } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CartIcon } from '../common/cart-icon';

export const ShopHeader = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  return (
    <View style={[styles.container]}>
      <FlexBox direction="row" align="center" gap={12} style={styles.innerContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            placeholder="chém giá 1k của tik..."
            style={[styles.input, { color: colors.text }]}
            placeholderTextColor={colors.textSecondary}
          />
          <Camera size={20} color={colors.textSecondary} />
        </View>
        <Text style={styles.searchButton}>Tìm kiếm</Text>
        <CartIcon />
      </FlexBox>
    </View>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.shopHeaderBackground,
    paddingBottom: 10,
  },
  innerContainer: {
    padding: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  input: { flex: 1, marginHorizontal: 8, fontSize: 14 },
  searchButton: { color: Colors.primary, fontWeight: '600' },
  cartBadge: { position: 'absolute', top: -5, right: -10, backgroundColor: Colors.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: colors.shopHeaderBackground },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});
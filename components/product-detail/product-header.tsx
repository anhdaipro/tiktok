import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MoreHorizontal, Search, Share2, ShoppingCart } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { CartIcon } from '../common/cart-icon';
const AnimateIconCart = Animated.createAnimatedComponent(ShoppingCart);
export const ProductHeader = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <FlexBox direction="row" align="center" gap={12}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Search size={16} color={colors.textSecondary} />
          <Text style={styles.searchText}>mì samyang</Text>
        </View>

        <FlexBox direction="row" align="center" gap={16}>
            <TouchableOpacity>
                <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
            <CartIcon />
            <TouchableOpacity>
                <MoreHorizontal size={24} color={colors.text} />
            </TouchableOpacity>
            
        </FlexBox>
      </FlexBox>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 36,
    gap: 8,
  },
  searchText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  
});
import FlexBox from '@/components/common/flex-box';
import { ProductVariantModal } from '@/components/product-detail/product-variant-modal';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { MessageCircle, ShoppingCart, Store } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomActionBar = () => {
  const { colors } = useTheme();
  const { showModal } = useModal();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const openVariantModal = () => {
    showModal({
      content: <ProductVariantModal />,
      animationType: 'slide-bottom',
      styleModalContent: {
        justifyContent: 'flex-end', // Đẩy modal xuống đáy màn hình
      },
      bgColor: 'rgba(0,0,0,0.5)',
    });
  };

  return (
    <View style={styles.container}>
      <FlexBox direction="row" align="center" style={styles.content}>
        <TouchableOpacity style={styles.iconBtn}>
            <Store size={20} color={colors.text} />
            <Text style={styles.iconText}>Cửa hàng</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconBtn}>
            <MessageCircle size={20} color={colors.text} />
            <Text style={styles.iconText}>Trò chuyện</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartBtn} onPress={openVariantModal}>
            <ShoppingCart size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyBtn} onPress={openVariantModal}>
            <Text style={styles.buyBtnTitle}>Mua ngay</Text>
            <Text style={styles.buyBtnPrice}>Flash Sale 57.420₫</Text>
        </TouchableOpacity>
      </FlexBox>
    </View>
  );
};

const createStyles = (colors: any, insets: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingBottom: insets.bottom,
  },
  content: {
    height: 60,
    paddingHorizontal: 16,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    gap: 4,
  },
  iconText: {
    fontSize: 10,
    color: colors.text,
  },
  cartBtn: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    gap: 4,
  },
  cartBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  buyBtn: {
    flex: 1.5,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnTitle: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyBtnPrice: {
    color: colors.white,
    fontSize: 10,
  }
});
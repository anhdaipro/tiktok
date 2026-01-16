import { BottomActionBar } from '@/components/product-detail/bottom-action-bar';
import { FlashSaleBanner } from '@/components/product-detail/flash-sale-banner';
import { ImageAnimated } from '@/components/product-detail/image-item-cart';
import { ProductHeader } from '@/components/product-detail/product-header';
import { ProductImageCarousel } from '@/components/product-detail/product-image-carousel';
import { ProductInfo } from '@/components/product-detail/product-info';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const MOCK_IMAGES = [
    'https://i.imgur.com/dHy2fWw.png', // Mì trộn
    'https://i.imgur.com/3Y2mYnm.png',
    'https://i.imgur.com/gB44t2D.png',
];

export default function ProductDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      <ProductHeader />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProductImageCarousel images={MOCK_IMAGES} />
        <FlashSaleBanner />
        <ProductInfo />
        
        {/* Placeholder for other sections */}
        <View style={styles.placeholder} />
      </ScrollView>
      <ImageAnimated/>
      <BottomActionBar />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    height: 200,
    backgroundColor: colors.backgroundSecondary,
  },
});

import { useTheme } from '@/contexts/theme-context';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const GAP_HORIZONTAL = 8;
const GAP_VERTICAL = 8;
interface Props {
  item: any;
  style?: any;
  index: number;
  numCols?: number;
}
export const ProductCard = ({ item, style, index, numCols = 2 }: Props) => {
  const isLeft = index % numCols == 0;
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  return (
    <TouchableOpacity
      onPress={() => router.push('/product-detail')}
      style={[styles.productCard, style, {
        marginLeft: isLeft ? 0 : GAP_HORIZONTAL / 2,
        marginRight: isLeft ? GAP_HORIZONTAL / 2 : 0,
        marginBottom: GAP_VERTICAL,
      }]}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.hasVideo && (
          <View style={styles.videoIndicator}>
            <Text style={styles.videoTime}>00:06</Text>
          </View>
        )}
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        {item.badge && (
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>{item.badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        {item.shopName && (
          <View style={styles.shopBadge}>
            <Text style={styles.shopBadgeText}>{item.shopName}</Text>
          </View>
        )}
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}đ</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString('vi-VN')}đ</Text>
          )}
        </View>

        {item.tags && (
          <View style={styles.tags}>
            {item.tags.map((tag: string, idx: number) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.productFooter}>
          <View style={styles.ratingContainer}>
            <Star size={12} color={colors.star} fill={colors.star} />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.sold}>Đã bán {item.sold}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
  productCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.overlayMedium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoTime: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderBottomLeftRadius: 8,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    marginTop: 4,
    fontWeight: 'bold',
  },
  dealBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.overlayDark,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  dealBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  productInfo: {
    padding: 8,
  },
  shopBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  shopBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  productTitle: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  tagText: {
    fontSize: 9,
    color: colors.successDark,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 11,
    color: colors.text,
  },
  sold: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
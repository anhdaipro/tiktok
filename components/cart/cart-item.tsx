import { DeleteItemCart } from '@/components/cart/delete-item-cart';
import FlexBox from '@/components/common/flex-box';
import { Checkbox } from '@/components/ui/checkbox';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Colors } from '@/constants/theme';
import { useAlert } from '@/contexts/alert-context';
import { useCartStore } from '@/stores/use-cart-store';
import { Image } from 'expo-image';
import { ChevronDown, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface CartItemType {
  id: string;
  name: string;
  image: string;
  variant?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  isSelected: boolean;
  isOutStock?: boolean;
  tags?: string[];
}

interface CartItemProps {
  item: CartItemType;
}
// Định nghĩa Props
interface RightActionProps {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  onDelete: () => void; // Truyền hàm delete vào đây
}

const RightAction = ({ prog, drag, onDelete }: RightActionProps) => {

  // 1. Sử dụng hook useAnimatedStyle để tạo style động
  const styleAnimation = useAnimatedStyle(() => {
    const trans = interpolate(
      drag.value,      // Giá trị đầu vào (quan trọng: phải .value)
      [-80, 0],        // Input Range
      [0, 80],         // Output Range
      Extrapolation.CLAMP // Tương đương extrapolate: 'clamp'
    );

    return {
      transform: [{ translateX: trans }],
    };
  });

  return (
    // TouchableOpacity giữ sự kiện onPress
    <TouchableOpacity onPress={onDelete} style={styles.deleteAction}>
      {/* Animated.View nhận styleAnimation */}
      <Animated.View style={[styleAnimation]}>
        <Trash2 size={24} color="#FFF" />
        <Text style={styles.deleteText}>Xóa</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // Use Zustand store directly
  const toggleItem = useCartStore((state) => state.toggleItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { showAlert } = useAlert();
  console.log('shop', 'item', item.id)

  const handleDelete = () => {
    showAlert({
      content: <DeleteItemCart itemId={item.id} executeDelete={() => removeItem(item.id)} />,
    });
  };

  return (
    <Swipeable
      renderRightActions={(progress, dragX) => (
        <RightAction onDelete={handleDelete} prog={progress} drag={dragX} />
      )}
    >
      <View style={[styles.container, item.isOutStock && styles.outStockContainer]}>
        <FlexBox direction="row" align="flex-start" gap={12}>
          {/* Checkbox */}
          <View style={styles.checkboxWrapper}>
            <Checkbox
              checked={item.isSelected}
              onPress={() => toggleItem(item.id)}
              disabled={item.isOutStock}
            />
          </View>

          {/* Image */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item.image }} style={styles.image} />
            {item.isOutStock && (
              <View style={styles.outStockOverlay}>
                <Text style={styles.outStockText}>Hết hàng</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            {/* Variant Selector */}
            <TouchableOpacity style={styles.variantSelector}>
              <Text style={styles.variantText} numberOfLines={1}>
                {item.variant || 'Không có lựa chọn này'}
              </Text>
              <ChevronDown size={14} color={Colors.gray500} />
            </TouchableOpacity>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <FlexBox direction="row" gap={4} style={{ marginBottom: 4 }}>
                {item.tags.map((tag, index) => (
                  <Text key={index} style={styles.tag}>
                    {tag}
                  </Text>
                ))}
              </FlexBox>
            )}

            {/* Price & Quantity */}
            <FlexBox direction="row" justify="space-between" align="flex-end" style={{ marginTop: 4 }}>
              <View>
                <Text style={styles.price}>
                  {item.price.toLocaleString('vi-VN')}₫
                </Text>
                {item.originalPrice && (
                  <Text style={styles.originalPrice}>
                    {item.originalPrice.toLocaleString('vi-VN')}₫
                  </Text>
                )}
              </View>

              {item.isOutStock ? (
                <TouchableOpacity style={styles.changeOptionBtn}>
                  <Text style={styles.changeOptionText}>Đổi lựa chọn</Text>
                </TouchableOpacity>
              ) : (
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.id, 'inc')}
                  onDecrease={() => updateQuantity(item.id, 'dec')}
                  onChange={(newQty) => setQuantity(item.id, newQty)}
                />
              )}
            </FlexBox>
          </View>
        </FlexBox>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    backgroundColor: Colors.primary, // Màu nền lộ ra khi vuốt
  },
  container: {
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
  },
  outStockContainer: {
    opacity: 0.7,
  },
  checkboxWrapper: {
    paddingTop: 24, // Căn giữa theo chiều dọc tương đối với ảnh
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: Colors.gray100,
  },
  outStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  outStockText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    color: Colors.gray800,
    lineHeight: 18,
    marginBottom: 4,
  },
  variantSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 6,
    maxWidth: '90%',
  },
  variantText: {
    fontSize: 11,
    color: Colors.gray500,
    marginRight: 4,
  },
  tag: {
    fontSize: 10,
    color: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.gray500,
    textDecorationLine: 'line-through',
  },
  changeOptionBtn: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeOptionText: {
    fontSize: 11,
    color: Colors.gray800,
  },
  deleteAction: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  }
});

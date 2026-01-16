// d:\app\tiktok\components\common\cart-icon.tsx
import { useIconContext } from '@/contexts/icon-cart-context';
import { useTheme } from '@/contexts/theme-context';
import { useCartStore } from '@/stores/use-cart-store';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
const AnimateIconCart = Animated.createAnimatedComponent(ShoppingCart);
const { width, height } = Dimensions.get('window');
console.log(width, height);

export const CartIcon = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  const { iconRef } = useIconContext();
  const router = useRouter();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const resetIschange = () => {
    setIsChange(false);
  }
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isChange = useCartStore((state) => state.isChange);
  const setIsChange = useCartStore((state) => state.setIsChange);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const animatedCartStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  // Kích hoạt animation khi cartCount thay đổi
  useEffect(() => {
    if (totalItems > 0 && isChange) {
      scale.value = withSequence(
        withTiming(1.5, { duration: 150 }),
        withSpring(1, { damping: 6, stiffness: 100 })
      );
      // Hiệu ứng rung lắc
      rotation.value = withSequence(
        withTiming(15, { duration: 50 }),
        withRepeat(withTiming(-15, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 }, (finished) => {
          if (finished) {
            runOnJS(resetIschange)();
          }
        })
      );

    }
  }, [totalItems, isChange]);


  return (

    <TouchableOpacity onPress={() => router.push('/cart')}>
      <View ref={iconRef} >
        <AnimateIconCart size={24} color={colors.text} style={animatedCartStyle} />
        {totalItems > 0 && (
          <Animated.View
            style={[styles.badge, animatedStyle]}
          >
            <Text style={styles.badgeText}>{totalItems}</Text>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>

  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  }
});

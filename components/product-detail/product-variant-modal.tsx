import { useIconContext } from '@/contexts/icon-cart-context';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { showToast } from '@/services/toast';
import { useCartStore } from '@/stores/use-cart-store';
import { Check } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Easing, runOnJS, withDelay, withTiming } from 'react-native-reanimated';
import { SIZE_IMAGE } from './image-item-cart';
import { QuantitySelector } from './variant/quantity-selector';
import { SizeSelector } from './variant/size-selector';
import { VariantHeader } from './variant/variant-header';
import { VariantSelector } from './variant/variant-selector';

// Mock Data giả lập
const VARIANTS_MODEL = [
  { id: '1', name: 'Mã 53', image: 'https://i.imgur.com/dHy2fWw.png' },
  { id: '2', name: 'Mã 20', image: 'https://i.imgur.com/3Y2mYnm.png' },
  { id: '3', name: 'Mã 74', image: 'https://i.imgur.com/gB44t2D.png' },
  { id: '4', name: 'Mã 52', image: 'https://i.imgur.com/dHy2fWw.png' },
  { id: '5', name: 'Mã 08', image: 'https://i.imgur.com/3Y2mYnm.png' },
];

const VARIANTS_SIZE = ['27', '28', '29', '30', '31', '32', '33', '34'];
const measureAsync = (ref: any): Promise<any> => {
  return new Promise(resolve => {
    if (!ref?.current) return resolve(null);
    ref.current.measure((x: any, y: any, width: any, height: any, pageX: any, pageY: any) => {
      resolve({ x, y, width, height, pageX, pageY });
    });
  });
};
const { width, height } = Dimensions.get('window');
const delay = 200
export const ProductVariantModal = () => {
  const { colors } = useTheme();
  const { hideModal } = useModal();
  const addToCart = useCartStore((state) => state.addToCart);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [selectedModel, setSelectedModel] = useState<string>(VARIANTS_MODEL[0].id);
  const [selectedSize, setSelectedSize] = useState<string>('29');
  const [quantity, setQuantity] = useState(1);
  const { iconRef,
    progress,
    scale,
    opacity,
    deltaXSV,
    imageRef,
    deltaYSV,
    setUri,
    setIsAnimating,
    isAnimating,
  } = useIconContext();
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));


  // Reanimated Shared Values


  const finishAnimation = () => {
    // Tạo cart item từ thông tin đã chọn
    const selectedVariant = VARIANTS_MODEL.find(m => m.id === selectedModel);
    const cartItem = {
      id: `${selectedModel}_${selectedSize}_${Date.now()}`, // unique ID
      name: 'Giày thể thao', // TODO: lấy từ props hoặc API
      image: selectedVariant?.image || VARIANTS_MODEL[0].image,
      variant: `${selectedVariant?.name} - Size ${selectedSize}`,
      price: 188911,
      originalPrice: 358000,
      quantity: quantity,
      isSelected: true,
      isOutStock: false,
    };

    // Thêm vào cart với shopId (TODO: lấy shopId thực từ props)
    addToCart('shop_demo', cartItem);

    setIsAnimating(false);
    // Reset values
    progress.value = 0;
    scale.value = 1;
    opacity.value = 1;
    showToast({
      message: "Đã thêm vào giỏ hàng",
      type: "default",
      backgroundColor: "rgba(0,0,0,0.6)",
      color: "#fff",
      position: "center",
      icon: () => (
        <Check size={28} color="#fff" style={{ marginBottom: 4 }} />
      ), // ⬆️ Tick nằm trên
      style: { borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 120 },
      titleStyle: { fontSize: 14, fontWeight: '600', marginTop: 10 },
    });
  };

  const handleConfirm = async () => {
    console.log(isAnimating, 'isAnimating')
    if (isAnimating) return;
    setUri(currentImage)
    // 1. đo vị trí ảnh
    const img = await measureAsync(imageRef);

    if (!img) return;

    // 2. đo vị trí icon giỏ hàng
    const icon = await measureAsync(iconRef);

    if (!icon) return;

    const targetX = icon.pageX;
    const targetY = icon.pageY;


    // 1. Measure vị trí hiện tại của ảnh
    const pageX = img.pageX + SIZE_IMAGE / 2;
    const pageY = img.pageY + SIZE_IMAGE / 2;
    // Tính khoảng cách cần di chuyển (Delta)
    const deltaX = targetX - pageX;
    const deltaY = targetY - pageY;

    // Set giá trị delta cho animation parabol
    deltaXSV.value = deltaX;
    deltaYSV.value = deltaY;
    console.log(img.pageX, img.pageY)
    console.log(targetX, targetY)
    console.log(pageX, pageY)
    hideModal();
    setIsAnimating(true);
    // 2. Bắt đầu Animation
    const duration = 1000;
    const easing = Easing.ease;

    progress.value = withDelay(delay, withTiming(1, { duration, easing }));
    scale.value = withDelay(delay, withTiming(0.1, { duration, easing }));
    opacity.value = withDelay(delay, withTiming(0, { duration, easing }, (finished) => {
      if (finished) {
        runOnJS(finishAnimation)();
      }
    }));
  };

  // Tìm hình ảnh của model đang chọn
  const currentImage = VARIANTS_MODEL.find(m => m.id === selectedModel)?.image || VARIANTS_MODEL[0].image;

  return (
    <View style={styles.container}>
      {/* Header: Info sản phẩm */}
      <VariantHeader
        image={currentImage}
        price="188.911₫"
        originalPrice="358.000₫"
        stock={1234}
        onClose={hideModal}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Mẫu */}
        <VariantSelector
          variants={VARIANTS_MODEL}
          selectedId={selectedModel}
          onSelect={setSelectedModel}
        />

        {/* Section: Size */}
        <SizeSelector sizes={VARIANTS_SIZE} selectedSize={selectedSize} onSelect={setSelectedSize} />

        {/* Section: Số lượng */}
        <QuantitySelector
          quantity={quantity}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
      </ScrollView>

      {/* Footer: Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={isAnimating}>
          <Text style={styles.confirmBtnText}>Mua ngay</Text>
          <Text style={styles.confirmSubText}>Flash Sale 188.911₫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%', // Chiếm tối đa 85% màn hình
    width: '100%',
  },
  content: {
    padding: 16,
  },
  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmSubText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
  },
});

import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { LucideIcon } from 'lucide-react-native';
import React, { memo, useCallback } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnUI,
  scrollTo,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';
export interface TabConfig<T> {
  id: T;
  icon?: LucideIcon;
  label?: string;
}

interface TabsProps<T> {
  onTabChange: (tab: T) => void;
  tabs: TabConfig<T>[];
  scrollX: SharedValue<number>;
}

const TabItem = memo(({
  item,
  index,
  scrollX,
  onTabChange,
  onLayout,
  styles,
  colors,
}: {
  item: TabConfig<any>;
  index: number;
  scrollX: SharedValue<number>;
  onTabChange: (id: any) => void;
  onLayout: (e: LayoutChangeEvent) => void;
  styles: any;
  colors: any;
}) => {
  const Icon = item.icon;
  const AnimatedIcon = Icon ? Animated.createAnimatedComponent(Icon) : null;

  const animatedStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      scrollX.value,
      [index - 1, index - 0.2, index, index + 0.2, index + 1],
      [Colors.gray500, colors.white, colors.white, colors.white, Colors.gray500]
    );
    return {
      color: textColor,
    };
  });

  return (
    <TouchableOpacity
      onLayout={onLayout}
      style={styles.tab}
      onPress={() => onTabChange(item.id)}
    >
      {AnimatedIcon && (
        <AnimatedIcon size={24} color={animatedStyle.color} />
      )}
      {item.label && (
        <Animated.Text style={[{ fontWeight: '600', fontSize: 15 }, animatedStyle]}>
          {item.label}
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
});


const WIDTH_UNDERLINE = 30;

export const ScrollTabs = <T extends string | number>({ onTabChange, tabs, scrollX }: TabsProps<T>) => {
  const { colors } = useTheme();
  const styles = createThemedStyles(colors);
  const layouts = useSharedValue<{ x: number; width: number }[]>([]);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const containerWidth = useSharedValue(0);
  const handleLayout = useCallback((event: LayoutChangeEvent, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    runOnUI(() => {
      layouts.value[index] = { x, width };
    })();
  }, []);
  // 1. Lưu trữ dữ liệu layout để tránh loop trong style hook
  const interpolationData = useDerivedValue(() => {
    const currentLayouts = layouts.value;
    if (currentLayouts.length !== tabs.length) return null;

    const inputRange = tabs.map((_, i) => i);
    const outputRangeX = currentLayouts.map(
      (l) => l.x + (l.width - WIDTH_UNDERLINE) / 2
    );
    const outputRangeCenter = currentLayouts.map(
      (l) => l.x + l.width / 2
    );

    return { inputRange, outputRangeX, outputRangeCenter };
  }, [tabs.length]);

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    const data = interpolationData.value;
    if (!data || data.inputRange.length < 2) return { opacity: 0 };

    const translateX = interpolate(
      scrollX.value,
      data.inputRange,
      data.outputRangeX,
      Extrapolation.CLAMP
    );

    return {
      opacity: 1,
      transform: [{ translateX }],
    };
  });

  // 3. Tự động scroll container để giữ tab active ở giữa (Center Active Tab)
  useAnimatedReaction(
    () => ({
      x: scrollX.value,
      data: interpolationData.value,
      width: containerWidth.value
    }),
    (curr, prev) => {
      if (!curr.data || curr.width === 0 || curr.x === prev?.x) return;

      const { inputRange, outputRangeCenter } = curr.data;

      // Tính toán điểm giữa của tab hiện tại
      const currentTabCenter = interpolate(
        curr.x,
        inputRange,
        outputRangeCenter,
        Extrapolation.CLAMP
      );

      // Scroll sao cho tâm của tab nằm giữa màn hình
      const targetScrollX = currentTabCenter - curr.width / 2;
      scrollTo(scrollViewRef, targetScrollX, 0, true);
    }
  );
  const handleLayoutView = useCallback((event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    runOnUI(() => {
      containerWidth.value = width;
    })();
  }, []);

  return (
    <View style={styles.container} onLayout={handleLayoutView}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TabItem
            key={String(tab.id)}
            item={tab}
            index={index}
            scrollX={scrollX}
            onTabChange={onTabChange}
            onLayout={(e) => handleLayout(e, index)}
            styles={styles}
            colors={colors}
          />
        ))}
        <Animated.View style={[styles.underline, { width: WIDTH_UNDERLINE }, animatedUnderlineStyle]} />
      </Animated.ScrollView>
    </View>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1, // Xác định chiều cao cố định hoặc linh hoạt cho Tabs
  },
  tabContainer: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  underline: {
    width: WIDTH_UNDERLINE,
    height: 3,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    borderRadius: 2,
  },
});

export default memo(ScrollTabs) as typeof ScrollTabs;
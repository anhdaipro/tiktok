import { useTheme } from '@/contexts/theme-context';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedBar = ({ maxHeight, minHeight, isActive = true }: { maxHeight: number, minHeight?: number, isActive?: boolean }) => {
  const heightAnim = useSharedValue(Math.random() * maxHeight);
  const { colors } = useTheme();

  useEffect(() => {
    if (!isActive) return;

    const animate = () => {
      'worklet';
      const randomHeight = minHeight
        ? Math.max(Math.random() * maxHeight, minHeight)
        : Math.random() * maxHeight;

      heightAnim.value = withTiming(
        randomHeight,
        {
          duration: 300,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(animate)();
          }
        }
      );
    };

    animate();
  }, [maxHeight, minHeight, isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  return <Animated.View style={[styles.bar, animatedStyle, { backgroundColor: colors.text }]} />;
};

export default AnimatedBar;

const styles = StyleSheet.create({
  bar: { width: 2, borderRadius: 2 },
});
import { Colors } from '@/constants/theme';
import { VideoPlayer } from 'expo-video';
import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 12;
const PADDING_VERTICAL = 16;
const SLIDER_WIDTH = width - PADDING_HORIZONTAL * 2;
const thumbSize = 8;
const HEIGHT_SLIDER = 2;

interface VideoSliderProps {
  player: VideoPlayer;
  duration: number;
  isActive: boolean;
  timeInterval: number;
  onSlidingStart?: () => void;
  onSlidingComplete?: () => void;
}

export const VideoSlider = ({ player, duration, isActive, timeInterval, onSlidingStart, onSlidingComplete }: VideoSliderProps) => {
  const progress = useSharedValue(0);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isAnimating = useSharedValue(false);

  // Tối ưu: Chỉ lắng nghe timeUpdate khi item này đang Active
  useEffect(() => {
    if (!isActive || !player) return;
    const endSub = player.addListener('playToEnd', () => {
      progress.value = 0;
    });

    const sub = player.addListener('timeUpdate', (e) => {
      if (isDragging.value) return;

      const newProgress = e.currentTime / duration;
      progress.value = withTiming(newProgress, {
        duration: timeInterval,
        easing: Easing.linear, // Linear để sync tốt hơn với video

      });
    });

    return () => {
      sub.remove();
      endSub.remove();
      progress.value = 0;

    };
  }, [player, isActive, duration, timeInterval]);
  const endGesture = () => {
    const time = progress.value * duration;
    player.currentTime = time;
    onSlidingComplete?.();
  };

  // Memoize gesture để tránh re-create
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin((event) => {
          isDragging.value = true;
          startX.value = progress.value * SLIDER_WIDTH;
        })
        .onUpdate((event) => {
          let newPos = startX.value + event.translationX;
          newPos = Math.max(0, Math.min(newPos, SLIDER_WIDTH));
          progress.value = newPos / SLIDER_WIDTH;
        })
        .onEnd(() => {
          runOnJS(endGesture)();
          isDragging.value = false;
        })
        .activeOffsetX([-10, 10])
        .failOffsetY([-10, 10]),
    [duration, player, onSlidingStart, onSlidingComplete]
  );

  const animatedWidthStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * SLIDER_WIDTH }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.progressContainer}>
        <View style={styles.sliderContainer}>
          <Animated.View style={[styles.sliderProgress, animatedWidthStyle]} />
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                left: -thumbSize / 2,
              },
              thumbStyle,
            ]}
          />
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    width: '100%',
    height: HEIGHT_SLIDER,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: Colors.static.white,
  },
  progressContainer: {
    paddingVertical: PADDING_VERTICAL,
    zIndex: 20, // Đảm bảo nằm trên các layer khác
  },
  thumb: {
    backgroundColor: Colors.static.white,
    position: 'absolute',
    left: 0,
    bottom: -thumbSize / 2 + HEIGHT_SLIDER / 2,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';

interface CustomSwitchProps extends TouchableOpacityProps {
  value: boolean | undefined;
  onValueChange: (value: boolean) => void;
}
const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value, 
  onValueChange,
  ...props
}) => {
  // Giá trị Animated cho vị trí của thumb (0 = off, 1 = on)
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Kích thước
  const trackWidth = 50;
  const trackHeight = 28;
  const thumbSize = 24;
  const thumbPadding = 2; // (trackHeight - thumbSize) / 2
  const translateMax = trackWidth - thumbSize - thumbPadding * 2; // Quãng đường di chuyển

  useEffect(() => {
    // Chạy animation khi prop `value` thay đổi
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200, // Tốc độ animation
      easing: Easing.bezier(0.4, 0, 0.2, 1), // Easing mượt mà
      useNativeDriver: true, // Hiệu năng tốt hơn
    }).start();
  }, [value, translateMax]);

  // Nội suy (interpolate) màu sắc cho track
  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.gray300, Colors.secondary], // Màu khi Off -> Màu khi On
  });

  // Nội suy (interpolate) vị trí X cho thumb
  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, translateMax],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      {...props}
      onPress={() => onValueChange(!value)}>
      {/* 1. Phần Track (nền) */}
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: trackColor,
          },
        ]}>
        {/* 2. Phần Thumb (nút tròn) */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              transform: [{translateX: thumbTranslateX}],
              // Thêm padding cho thumb
              margin: thumbPadding,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: Colors.static.white,
    elevation: 2,
    shadowColor: Colors.secondary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

export default CustomSwitch;
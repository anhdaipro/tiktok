
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
interface SpinningMusicDiscProps {
  imageUrl: string;
  isPlaying: boolean;
}

const SpinningMusicDisc: React.FC<SpinningMusicDiscProps> = ({ imageUrl, isPlaying }) => {
  // 1. Khởi tạo giá trị Animated để điều khiển việc quay
  const spinValue = useRef(new Animated.Value(0)).current;

  // 2. Cấu hình animation lặp vô tận
  const spinAnimation = useRef(
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, // Quay từ 0 đến 1
        duration: 4000, // Tốc độ: 4 giây cho 1 vòng quay
        easing: Easing.linear, // Quay đều, không nhanh chậm
        useNativeDriver: true, // Rất quan trọng! Giúp animation chạy trên UI thread, mượt mà hơn
      })
    )
  ).current;

  // 3. Điều khiển animation dựa vào prop `isPlaying`
  useEffect(() => {
    if (isPlaying) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
      // Nếu bạn muốn nó dừng lại ở vị trí hiện tại, chỉ cần stop().
      // Nếu muốn nó reset về vị trí ban đầu, dùng spinAnimation.reset();
    }

    // Cleanup khi component bị unmount
    return () => spinAnimation.stop();
  }, [isPlaying, spinAnimation]);

  // 4. Ánh xạ giá trị từ 0-1 sang góc quay 0-360 độ
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.musicDisc, { transform: [{ rotate: spin }] }]}>
      <Image source={{ uri: imageUrl }} style={styles.musicDiscImage} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  musicDisc: {
    marginTop: 20,
    width: 48,
    height: 48,
    backgroundColor: '#222',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#111',
  },
  musicDiscImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});

export default SpinningMusicDisc;

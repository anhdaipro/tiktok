import { Colors } from '@/constants/theme';
import { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { WheelSvg } from './wheel-svg';
const SLICES = [
  {
    color: Colors.gray100,
    label: 'Phần 1',
  },
  {
    color: Colors.gray200,
    label: 'Phần 2',
  },
  {
    color: Colors.gray300,
    label: 'Phần 3',
  },
  {
    color: Colors.gray500,
    label: 'Phần 4',
  },
  {
    color: Colors.gray100,
    label: 'Phần 5',
  },
  {
    color: Colors.gray100,
    label: 'Phần 6',
  },
  {
    color: Colors.gray100,
    label: 'Phần 7',
  },
  {
    color: Colors.gray100,
    label: 'Phần 8',
  },
  {
    color: Colors.gray100,
    label: 'Phần 9',
  },
  {
    color: Colors.gray100,
    label: 'Phần 10',
  },
  {
    color: Colors.gray100,
    label: 'Phần 11',
  },
  {
    color: Colors.gray100,
    label: 'Phần 12',
  },

]
const getWinnerIndex = (
  rotationDeg: number,
  sliceCount: number
) => {
  const anglePerSlice = 360 / sliceCount;

  // Chuẩn hoá
  const normalized = (360 - (rotationDeg % 360) + 90) % 360;

  return Math.floor(normalized / anglePerSlice);
};

export const Wheel = () => {
  const rotation = useRef(new Animated.Value(0)).current;
  const [disabled, setDisabled] = useState(false);

  const handleEndSpin = (finalAngle: number) => {
    setDisabled(false);
    const winnerIndex = getWinnerIndex(finalAngle, SLICES.length);
    console.log('Winner index:', winnerIndex);
  };

  const spin = () => {
    if (disabled) return;
    setDisabled(true);

    const rounds = 6; // số vòng quay tối thiểu
    const randomAngle = Math.random() * 360;
    let currentRotation = 0;

    rotation.stopAnimation((value) => {
      currentRotation = value; // lấy góc hiện tại
      const finalValue = currentRotation + rounds * 360 + randomAngle;

      Animated.timing(rotation, {
        toValue: finalValue,
        duration: 8000,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true, // rất quan trọng để mượt
      }).start(() => {
        const actualDegree = finalValue % 360;
        handleEndSpin(actualDegree);
      });
    });
  };

  const animatedStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };


  return (
    <>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={animatedStyle}>
          <WheelSvg slices={SLICES} />
        </Animated.View>

        {/* Arrow overlay */}
        <View style={styles.arrowContainer}>
          <View style={styles.arrow} />
          <Pressable disabled={disabled} onPress={spin} style={styles.centerCircle} >
            <Text >Quay</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  arrowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    left: 28,
    transform: [{ rotate: '90deg' }],
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    zIndex: 0,
    borderRightWidth: 10,
    borderBottomWidth: 32,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF3333',
  },
  centerCircle: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    borderWidth: 2,
    borderColor: '#333',

  },
});
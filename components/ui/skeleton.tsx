

import { Colors } from '@/constants/theme';
import React, { memo, useEffect, useRef } from 'react';
import { Animated, DimensionValue, ViewStyle } from 'react-native';

interface SkeletonProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Skeleton: Component hiển thị hiệu ứng loading với animation lấp lánh.
 */
const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
}) => {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        const anim = Animated.loop(
        Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
        );
        anim.start();
        return () => anim.stop();
    }, [opacity]);

    return <Animated.View style={[styles.skeleton, { width, height, borderRadius }, { opacity }, style]} />;
};
export default memo(Skeleton)
const styles = ({
    skeleton: {
        backgroundColor: Colors.gray200,
    },
});
import { Colors } from '@/constants/theme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const CORNER_BORDER_WIDTH = 4;
const HEIGHT_GRID = 60;
const gridSize = 6;

const GridPattern = React.memo(({ numRows, numCols }: { numRows: number; numCols: number }) => {
  const lines = [];
  for (let i = 0; i <= numRows; i++) {
    lines.push(<View key={`h-${i}`} style={[styles.gridLine, { top: i * gridSize, width: '100%' }]} />);
  }
  for (let i = 0; i <= numCols; i++) {
    lines.push(<View key={`v-${i}`} style={[styles.gridLine, { left: i * gridSize, height: '100%' }]} />);
  }
  return <View style={StyleSheet.absoluteFill}>{lines}</View>;
});

interface ScannerFrameProps {
  frameSize: number;
  cornerSize: number;
  isScanningActive: boolean;
  onLayout?: (event: any) => void;
}

export const ScannerFrame: React.FC<ScannerFrameProps> = ({
  frameSize,
  cornerSize,
  isScanningActive,
  onLayout,
}) => {
  const scanLinePosition = useSharedValue(0);

  useEffect(() => {
    scanLinePosition.value = withRepeat(
      withTiming(frameSize, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [frameSize]);

  const animatedScanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  const numRows = Math.ceil(HEIGHT_GRID / gridSize);
  const numCols = Math.ceil(frameSize / gridSize);

  return (
    <View style={[styles.scannerFrame, { width: frameSize, height: frameSize }]} onLayout={onLayout}>
      <View style={[styles.corner, styles.topLeft, { width: cornerSize, height: cornerSize }]} />
      <View style={[styles.corner, styles.topRight, { width: cornerSize, height: cornerSize }]} />
      <View style={[styles.corner, styles.bottomLeft, { width: cornerSize, height: cornerSize }]} />
      <View style={[styles.corner, styles.bottomRight, { width: cornerSize, height: cornerSize }]} />
      {isScanningActive && (
        <Animated.View style={[styles.scanLine, animatedScanLineStyle]}>
          <GridPattern numRows={numRows} numCols={numCols} />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)']}
            style={styles.scanGradient}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scannerFrame: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    borderColor: Colors.static.white,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderLeftWidth: CORNER_BORDER_WIDTH,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_BORDER_WIDTH,
    borderRightWidth: CORNER_BORDER_WIDTH,
  },
  scanLine: {
    width: '100%',
    height: HEIGHT_GRID,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scanGradient: {
    flex: 1,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 0.5,
    height: 0.5,
  },
});

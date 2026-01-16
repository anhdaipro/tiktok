import React from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';

interface LayerItemProps {
  id: string;
  start: number;
  end: number;
  totalDuration: number;
  onUpdate: (id: string, start: number, end: number) => void;
}

export default function LayerTimelineItem({ id, start, end, totalDuration, onUpdate }: LayerItemProps) {
  const { width } = Dimensions.get('window');
  const itemWidth = ((end - start) / totalDuration) * (width - 40);
  const leftStart = (start / totalDuration) * (width - 40);
  const pan = { dx: 0 };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const deltaTime = (gesture.dx / (width - 40)) * totalDuration;
      let newStart = Math.max(0, start + deltaTime);
      let newEnd = Math.min(totalDuration, end + deltaTime);
      if (newEnd - newStart < 0.5) newEnd = newStart + 0.5;
      onUpdate(id, newStart, newEnd);
    },
  });

  return <View style={[styles.item, { width: itemWidth, left: leftStart }]} {...panResponder.panHandlers} />;
}

const styles = StyleSheet.create({
  item: { position: 'absolute', height: 40, backgroundColor: 'rgba(0,150,255,0.7)', borderRadius: 4 },
});

import { LayerTimeline } from '@/types/upload';
import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface Props {
  layers: LayerTimeline[];
  currentTime: number;
}

export default function LayerPreview({ layers, currentTime }: Props) {
  return (
    <View style={styles.container}>
      {layers.map(layer => {
        if (currentTime < layer.start || currentTime > layer.end) return null;
        const progress = (currentTime - layer.start) / (layer.end - layer.start);
        const opacity = layer.fade ? Math.min(1, Math.max(0, progress)) : 1;
        const scale = layer.scale ? layer.scale.from + (layer.scale.to - layer.scale.from) * progress : 1;
        const rotate = layer.rotate ? `${layer.rotate.from + (layer.rotate.to - layer.rotate.from) * progress}deg` : '0deg';

        return layer.type === 'text' ? (
          <AnimatedText key={layer.id} style={[styles.textLayer, { left: layer.x, top: layer.y, opacity, transform: [{ scale }, { rotate }] }]}>{layer.content}</AnimatedText>
        ) : (
          <AnimatedImage key={layer.id} source={{ uri: layer.content }} style={[styles.stickerLayer, { left: layer.x, top: layer.y, opacity, transform: [{ scale }, { rotate }] }]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  textLayer: { position: 'absolute', fontSize: 24, fontWeight: 'bold', color: 'white' },
  stickerLayer: { position: 'absolute', width: 80, height: 80 },
});

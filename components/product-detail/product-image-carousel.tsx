import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

interface ProductImageCarouselProps {
    images: string[];
}

export const ProductImageCarousel = ({ images }: ProductImageCarouselProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeSlide, setActiveSlide] = useState(0);

  const onScroll = (event: any) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>
      <View style={styles.indicator}>
        <Text style={styles.indicatorText}>{activeSlide + 1}/{images.length}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    height: width, // Square image
    width: width,
    position: 'relative',
  },
  image: {
    width: width,
    height: width,
  },
  indicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.static.carouselIndicator,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    color: Colors.static.white,
    fontSize: 12,
  }
});
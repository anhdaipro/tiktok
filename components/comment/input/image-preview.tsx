import { X } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ImagePreviewProps {
  images: any[];
  onRemove: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemove }) => {
  if (images.length === 0) return null;

  return (
    <View pointerEvents="box-none">
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.previewContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {images.map((img, idx) => (
          <View key={idx} style={styles.previewItem}>
            <Image source={{ uri: img.uri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(idx)}>
              <X size={12} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    paddingTop: 24,
    gap: 12,
  },
  previewItem: {
    position: 'relative',
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    zIndex: 100,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

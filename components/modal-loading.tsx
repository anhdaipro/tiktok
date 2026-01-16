import { Colors } from '@/constants/theme';
import { useLoadingStore } from '@/stores/loading-store';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
export const ModalLoading = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      statusBarTranslucent={true}
    >
      <View style={[styles.backdrop]} />
      <View style={styles.container}>
        <ActivityIndicator size={'large'} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.static.overlay,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    backgroundColor: Colors.static.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
});
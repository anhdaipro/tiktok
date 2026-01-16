import { Colors } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ProcessingOverlay = () => (
  <View style={styles.processingOverlay}>
    <ActivityIndicator size="large" color={Colors.static.white} />
    <Text style={styles.processingText}>Đang xử lý...</Text>
  </View>
);

export const PermissionView = () => (
  <View style={styles.permissionContainer}>
    <Text style={styles.infoText}>Ứng dụng cần quyền truy cập camera để quét mã QR.</Text>
    <TouchableOpacity style={styles.permissionButton} onPress={() => Linking.openSettings()}>
      <Text style={styles.permissionButtonText}>Mở cài đặt</Text>
    </TouchableOpacity>
  </View>
);

export const CameraNotFoundView = () => (
    <Text style={styles.infoText}>Không tìm thấy camera</Text>
);

const styles = StyleSheet.create({
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  processingText: {
    color: Colors.static.white,
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

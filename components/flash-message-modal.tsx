// components/FlashMessageModal.tsx
import { setToastRef } from '@/services/toast';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';

const FlashMessageModal = () => {
  const [visible, setVisible] = useState(false);
  const flashRef = useRef<FlashMessage | null>(null);

  const show = (options: any) => {
    setVisible(true);
    setTimeout(() => {
      flashRef.current?.showMessage({
        ...options,
        onHide: () => {
          setVisible(false);
          options.onHide?.();
        }
      });
    }, 100); // Delay nhẹ cho Modal hiện hẳn
  };

  useEffect(() => {
    setToastRef({ show });
    return () => setToastRef(null);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <FlashMessage ref={flashRef} position="top" />
      </View>
    </Modal>
  );
};

export default FlashMessageModal;
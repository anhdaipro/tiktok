import { Colors } from '@/constants/theme';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, ViewProps } from 'react-native';

export type DataAlert = {
  content: ReactNode;
  stylePopup?: ViewProps['style'];
}

interface AlertContextType {
  showAlert: (data: DataAlert) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
  hideAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [alertContent, setAlertContent] = useState<ReactNode | null>(null);
  const [stylePopup, setStylePopup] = useState<ViewProps['style']>({});

  const showAlert = (data: DataAlert) => {
    setAlertContent(data.content);
    setStylePopup(data.stylePopup);
    setOpen(true);
  };

  const hideAlert = () => {
    setOpen(false);
    setAlertContent(null);
  };

  const value = useMemo(() => ({ showAlert, hideAlert }), []);

  return (
    <AlertContext.Provider value={value}>
      {children}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hideAlert} // Android back button
      >
        <TouchableWithoutFeedback onPress={hideAlert}>
          <View style={[styles.backdrop, stylePopup]} />
        </TouchableWithoutFeedback>

        {alertContent}
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.static.overlay,
  },
});

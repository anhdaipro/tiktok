import { Colors } from "@/constants/theme";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewProps
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";


type AnimationType =
  | "fade"
  | "slide-right"
  | "slide-left"
  | "slide-bottom"
  | "scale";

interface ModalData {
  content: ReactNode | null;
  animationType?: AnimationType;
  styleModalContent?: ViewProps["style"];
  bgColor?: string;
  duration?: number;
  opacity?: number;
}

interface ModalContextType {
  showModal: (data: ModalData, callback?: () => void) => void;
  hideModal: (callback?: () => void) => void;
}

const defaultData = {
  bgColor: Colors.static.overlay,
  styleModalContent: {},
  duration: 300,
  opacity: 1,
};
export const defaultDuration = 300
const ModalContext = createContext<ModalContextType | undefined>(undefined);
const { width, height } = Dimensions.get("window");

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [animationType, setAnimationType] = useState<AnimationType>("fade");
  const [duration, setDuration] = useState<number>(defaultData.duration);
  const [styleModalContent, setStyleModalContent] = useState<ViewProps["style"]>(
    {}
  );
  const [bg, setBg] = useState<string>(defaultData.bgColor);

  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const showModal = useCallback((data: ModalData, callback?: () => void) => {
    setModalContent(data.content);
    setVisible(true);
    const type = data.animationType ?? "fade";
    let duration = defaultData.duration;
    if (type == 'fade'){
      duration = 0;
    }else if(data.duration){
      duration = data.duration
    }
    setDuration(duration);
    setBg(data.bgColor ?? defaultData.bgColor);
    setStyleModalContent(data.styleModalContent ?? defaultData.styleModalContent);

    const handleCallback = () => {
      callback?.();
    }
    
    setAnimationType(type);

    switch (type) {
      case "slide-right":
        translateX.value = width;
        translateX.value = withTiming(0, { duration });
        break;
      case "slide-left":
        translateX.value = -width;
        translateX.value = withTiming(0, { duration });
        break;
      case "slide-bottom":
        translateY.value = height;
        translateY.value = withTiming(0, { duration });
        break;
      case "scale":
        scale.value = 0.8;
        scale.value = withTiming(1, { duration });
        break;
    }

    opacity.value = withTiming(1, { duration }, (finished) => {
      // runOnJS(handleCallback)();
    });
  }, []);

  const hideModal = useCallback(
    (callback?: () => void) => {
      const cleanup = () => {
        setVisible(false);
        setModalContent(null);
        callback?.();
      };

      switch (animationType) {
        case "slide-right":
          translateX.value = withTiming(width, { duration });
          break;
        case "slide-left":
          translateX.value = withTiming(-width, { duration });
          break;
        case "slide-bottom":
          translateY.value = withTiming(height, { duration });
          break;
        case "scale":
          scale.value = withTiming(0.8, { duration });
          break;
      }

      opacity.value = withTiming(0, { duration }, (finished) => {
        if (finished) runOnJS(cleanup)();
      });
    },
    [animationType, duration]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const style: any = { opacity: opacity.value, transform: [] };

    switch (animationType) {
      case "slide-right":
      case "slide-left":
        style.transform.push({ translateX: translateX.value });
        break;
      case "slide-bottom":
        style.transform.push({ translateY: translateY.value });
        break;
      case "scale":
        style.transform.push({ scale: scale.value });
        break;
    }
    return style;
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const value = useMemo(() => ({ showModal, hideModal }), [showModal, hideModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => hideModal()}
      >
        <TouchableWithoutFeedback onPress={() => hideModal()}>
          <Animated.View
            style={[
              styles.backdrop,
              { backgroundColor: bg },
              backdropStyle,
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.modalContainer, styleModalContent, animatedStyle]}
          pointerEvents="box-none"
        >
          {modalContent}
        </Animated.View>
      </Modal>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.static.overlay,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
});

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};

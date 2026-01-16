// icon-context.tsx
import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Image, View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type IconContextType = {
  iconRef: React.RefObject<View | null>;
  imageRef: React.RefObject<Image | null>;
  uri: string;
  setUri: (uri: string) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  progress: SharedValue<number>;
  deltaXSV: SharedValue<number>;
  deltaYSV: SharedValue<number>;
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
};

const IconContext = createContext<IconContextType | null>(null);

export const CartIconProvider = ({ children }: { children: React.ReactNode }) => {
    const iconRef = useRef<View | null>(null);
    const imageRef = useRef<Image | null>(null);
    const progress = useSharedValue(0);
    const deltaXSV = useSharedValue(0);
    const deltaYSV = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const [uri, setUri] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const value = useMemo(() => ({imageRef, iconRef, uri, 
        progress, deltaXSV, deltaYSV, scale, opacity, 
        setUri, 
        isAnimating, 
        setIsAnimating }), [
        uri,
        isAnimating,
        setIsAnimating,
        setUri
    ]);
    return (
        <IconContext.Provider value={value}>
        {children}
        </IconContext.Provider>
    );
};

export const useIconContext = () => useContext(IconContext)!;

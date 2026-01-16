import { useIconContext } from "@/contexts/icon-cart-context";
import { useTheme } from "@/contexts/theme-context";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
const {width, height} = Dimensions.get('window');
export const SIZE_IMAGE = 100;
export const ImageAnimated = () =>{
    const {colors} = useTheme();
    const styles = themeStyle(colors);
    const {imageRef,
        progress,
        scale,
        opacity,
        deltaXSV,
        deltaYSV,
        isAnimating,
        uri,
    } = useIconContext();
    const animatedStyle = useAnimatedStyle(() => {
        const t = progress.value;
        // Tạo quỹ đạo cong (Parabol)
        // Công thức: Linear Path + Arc Offset
        // 4 * t * (1 - t) tạo ra hình vòm (0 tại t=0, 1 tại t=0.5, 0 tại t=1)
        const amplitude = 150; // Độ cao của vòm cung
        const translateX = deltaXSV.value * t;
        const translateY = deltaYSV.value * t - amplitude * 4 * t * (1 - t);

        return {
        transform: [
            { translateX },
            { translateY },
            { scale: scale.value },
        ],
        opacity: opacity.value,
        }
    });
    return (
        <View ref={imageRef} style={{ position: 'absolute',
                    top:height/2-SIZE_IMAGE/2,
                    left: width/2-SIZE_IMAGE/2,
                    zIndex: 999, }}>
            {isAnimating && <Animated.Image
                source={{ uri }}
                style={[
                    styles.productImage,
                    animatedStyle,
                ]}
            />}
        </View>
                      
    )
}
const themeStyle = (colors: any) => StyleSheet.create({
    productImage: {
    width: SIZE_IMAGE,
    height: SIZE_IMAGE,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
  },

})
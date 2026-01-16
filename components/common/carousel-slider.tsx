import { useTheme } from '@/contexts/theme-context';
import { useFocusEffect } from '@react-navigation/native';
import { Image, ImageStyle } from 'expo-image';
import React, { memo, ReactNode, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

export interface CarouselItem {
    id: string;
    image: string;
    [key: string]: any;
}

interface CarouselSliderProps<T extends CarouselItem = CarouselItem> {
    /** Array of items to display */
    data: T[];
    /** Width of each carousel item */
    width: number;
    /** Height of each carousel item */
    height: number;
    /** Auto scroll interval in milliseconds (default: 3000) */
    autoScrollInterval?: number;
    /** Border radius for items (default: 12) */
    borderRadius?: number;
    /** Show dot indicators (default: true) */
    showDots?: boolean;
    /** Vertical padding (default: 12) */
    paddingVertical?: number;
    /** Custom render function for items */
    renderItem?: (item: T, index: number) => ReactNode;
    /** Container style */
    containerStyle?: ViewStyle;
    /** Item container style */
    itemStyle?: ViewStyle;
    /** Image style (only used if renderItem is not provided) */
    imageStyle?: ImageStyle;
    /** Dot color (defaults to theme text color) */
    dotColor?: string;
    /** Active dot opacity (default: 1) */
    activeDotOpacity?: number;
    /** Inactive dot opacity (default: 0.3) */
    inactiveDotOpacity?: number;
}

const AnimatedDot = memo(
    ({
        styles,
        index,
        activeIndex,
    }: {
        styles: any;
        index: number;
        activeIndex: SharedValue<number>;
    }) => {
        const animatedStyle = useAnimatedStyle(() => {
            return {
                opacity: withTiming(activeIndex.value === index ? 1 : 0.3, {
                    duration: 100,
                }),
            };
        });

        return <Animated.View style={[styles.dot, animatedStyle]} />;
    }
);

AnimatedDot.displayName = 'AnimatedDot';

export const CarouselSlider = <T extends CarouselItem = CarouselItem>(
    {
        data,
        width,
        height,
        autoScrollInterval = 3000,
        borderRadius = 12,
        showDots = true,
        paddingVertical = 12,
        renderItem,
        containerStyle,
        itemStyle,
        imageStyle,
        dotColor,
        activeDotOpacity = 1,
        inactiveDotOpacity = 0.3,
    }: CarouselSliderProps<T>
) => {
    const { colors } = useTheme();
    const styles = useMemo(
        () =>
            createStyles(
                colors,
                width,
                height,
                borderRadius,
                paddingVertical,
                dotColor || colors.text
            ),
        [colors, width, height, borderRadius, paddingVertical, dotColor]
    );

    /** FAKE INFINITE SCROLL */
    const infiniteData = useMemo(
        () => [data.at(-1)!, ...data, data[0]!],
        [data]
    );

    const translateX = useSharedValue(-width);
    const currentIndex = useSharedValue(1);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const activeIndex = useSharedValue(0);

    const updateIndex = (index: number) => {
        'worklet';
        currentIndex.value = index;

        const realIndex =
            index === 0
                ? data.length - 1
                : index === infiniteData.length - 1
                    ? 0
                    : index - 1;
        activeIndex.value = realIndex;
    };
    console.log('index')

    const moveTo = useCallback((targetIndex: number, animated = true) => {
        'worklet';
        console.log('targetIndex', targetIndex)
        translateX.value = withTiming(
            -width * targetIndex,
            {
                duration: animated ? 500 : 0,
                easing: Easing.out(Easing.cubic),
            },
            (finished) => {
                if (!finished) return;
                let newIndex = targetIndex;
                if (targetIndex === 0) {
                    newIndex = data.length;
                    translateX.value = -width * newIndex;
                }

                if (targetIndex === infiniteData.length - 1) {
                    newIndex = 1;
                    translateX.value = -width * newIndex;
                }

                updateIndex(newIndex);
            }
        );
    }, [width, data.length, infiniteData.length]);

    const stopAutoScroll = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
    }, []);

    const resetAutoScroll = useCallback(() => {
        if (autoScrollInterval <= 0) return;
        timerRef.current = setInterval(() => {
            moveTo(currentIndex.value + 1);
        }, autoScrollInterval);
    }, [autoScrollInterval, moveTo]);

    /** AUTO SCROLL */
    useFocusEffect(
        useCallback(() => {
            if (autoScrollInterval <= 0) return;

            timerRef.current = setInterval(() => {
                moveTo(currentIndex.value + 1);
            }, autoScrollInterval);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };
        }, [autoScrollInterval, moveTo])
    );


    /** GESTURE */
    const panGesture = useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetX([-10, 10]) // Only activate on horizontal swipe >= 10px
                .failOffsetY([-10, 10]) // Cancel gesture if vertical swipe >= 10px
                .onBegin(() => {
                    runOnJS(stopAutoScroll)();
                })
                .onUpdate((e) => {
                    translateX.value = -width * currentIndex.value + e.translationX;
                })
                .onEnd((e) => {
                    if (Math.abs(e.translationX) < width / 3) {
                        translateX.value = withTiming(
                            -width * currentIndex.value,
                            {
                                duration: 300,
                                easing: Easing.linear,
                            }
                        );
                        updateIndex(currentIndex.value);

                    } else if (e.translationX < 0) {
                        moveTo(currentIndex.value + 1);

                    } else {
                        moveTo(currentIndex.value - 1);
                    }
                    runOnJS(resetAutoScroll)();
                }),
        [width, stopAutoScroll, resetAutoScroll, moveTo]
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const defaultRenderItem = (item: T) => (
        <Image
            source={{ uri: item.image }}
            style={[styles.image, imageStyle]}
        />
    );

    return (
        <View style={[styles.container, containerStyle]}>
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.track,
                        { width: infiniteData.length * width },
                        animatedStyle,
                    ]}
                >
                    {infiniteData.map((item, index) => (
                        <View key={index} style={[styles.item, itemStyle]}>
                            {renderItem
                                ? renderItem(item, index)
                                : defaultRenderItem(item)}
                        </View>
                    ))}
                </Animated.View>
            </GestureDetector>

            {/* DOT INDICATORS */}
            {showDots && (
                <View style={styles.dots}>
                    {data.map((_, i) => (
                        <AnimatedDot
                            key={i}
                            index={i}
                            activeIndex={activeIndex}
                            styles={styles}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

CarouselSlider.displayName = 'CarouselSlider';

const createStyles = (
    colors: any,
    width: number,
    height: number,
    borderRadius: number,
    paddingVertical: number,
    dotColor: string
) =>
    StyleSheet.create({
        container: {
            paddingVertical,
            overflow: 'hidden',
        },
        track: {
            flexDirection: 'row',
        },
        item: {
            width,
            height,
            borderRadius,
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        dots: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 12,
            gap: 6,
        },
        dot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: dotColor,
        },
    });

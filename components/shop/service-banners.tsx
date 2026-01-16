import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Gift, ShoppingBag, Sparkles, Video } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    measure,
    runOnJS,
    SharedValue,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';

const ITEM_SIZE = 60;
const GAP = 12;
const PADDING = 16;

const SERVICE_BANNERS = [
    { id: 'voucher', title: 'Voucher Xtra', icon: Gift },
    { id: 'ship', title: 'Ưu đãi vận chuyển', icon: ShoppingBag },
    { id: 'live', title: 'Mua sắm qua LIVE', icon: Video },
    { id: 'sale', title: 'Chém giá', icon: Sparkles },
    { id: 'mall', title: 'TikTok Shop', icon: ShoppingBag },
    { id: 'mall2', title: 'TikTok Shop Mall 1', icon: ShoppingBag },
];

export const ServiceBanners = memo(() => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const scrollX = useSharedValue(0);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const contentRef = useAnimatedRef<Animated.View>();

    // JS state chỉ để render pagination dots
    const [pages, setPages] = useState(1);

    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x;
    });

    // đo container & content width trên UI thread
    const containerWidth = useDerivedValue(() => measure(scrollRef)?.width ?? 0);
    const contentWidth = useDerivedValue(() => measure(contentRef)?.width ?? 0);

    // Tính số page & paddingRight UI thread
    const pageCount = useDerivedValue(() => {
        if (containerWidth.value === 0) return 1;
        return Math.ceil(contentWidth.value / containerWidth.value);
    });

    const paddingRight = useDerivedValue(() => {
        if (containerWidth.value === 0) return 0;
        const totalWidth = pageCount.value * containerWidth.value;
        return Math.max(0, totalWidth - contentWidth.value);
    });
    const animatedScrollContentStyle = useAnimatedStyle(() => ({
        paddingRight: paddingRight.value,
    }));

    // Update JS state pages khi pageCount thay đổi
    useDerivedValue(() => {
        if (pageCount.value === pages) return;
        runOnJS(setPages)(pageCount.value);
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                horizontal
                ref={scrollRef}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                <Animated.View
                    ref={contentRef}
                    style={[styles.scrollContent, animatedScrollContentStyle]}
                >
                    {SERVICE_BANNERS.map((item) => (
                        <BannerItem key={item.id} item={item} />
                    ))}
                </Animated.View>
            </Animated.ScrollView>

            {/* Pagination */}
            <View style={styles.pagination}>
                {Array.from({ length: pages }).map((_, i) => (
                    <Dot key={i} index={i} scrollX={scrollX} containerWidth={containerWidth} colors={colors} />
                ))}
            </View>
        </View>
    );
});

// ================= Item =================
const BannerItem = memo(({ item }: any) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const Icon = item.icon;

    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.iconWrap}>
                <Icon size={32} color="white" />
            </View>
            <Text style={styles.title} numberOfLines={2}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );
});

// ================= Dot =================
interface DotProps {
    index: number;
    scrollX: SharedValue<number>;
    containerWidth: SharedValue<number>;
    colors: any;
}
const Dot: React.FC<DotProps> = ({ index, scrollX, containerWidth, colors }) => {
    const styles = createStyles(colors);
    const style = useAnimatedStyle(() => {
        const x = containerWidth.value * index;
        const prevX = containerWidth.value * (index - 1);
        const nextX = containerWidth.value * (index + 1);

        const width = interpolate(scrollX.value, [prevX, x, nextX], [6, 16, 6], Extrapolation.CLAMP);
        const backgroundColor = interpolateColor(
            scrollX.value,
            [prevX, x, nextX],
            [colors.dotInactive, colors.dotActive, colors.dotInactive]
        );
        return { width, backgroundColor };
    });

    return <Animated.View style={[styles.dot, style]} />;
};

// ================= Styles =================
const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            padding: PADDING,
            borderRadius: 12,
        },
        scrollContent: {
            gap: GAP,
            flexDirection: 'row',
        },
        card: {
            width: ITEM_SIZE,
            alignItems: 'center',
        },
        iconWrap: {
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderRadius: 16,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
        },
        title: {
            fontSize: 11,
            textAlign: 'center',
            color: colors.text,
            lineHeight: 14,
        },
        pagination: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 8,
            gap: 4,
        },
        dot: {
            height: 4,
            borderRadius: 2,
        },
    });

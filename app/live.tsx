import { FollowingChannelItem } from '@/components/live/following-channel-item';
import { LiveStreamData, LiveStreamGrid } from '@/components/live/live-stream-grid';
import { LiveVoucherBanner } from '@/components/live/live-voucher-banner';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const FOLLOWING_CHANNELS = [
    {
        id: '1',
        avatar: 'https://i.pravatar.cc/150?img=1',
        shopName: 'Jelly Jello',
        isLive: true,
    },
    {
        id: '2',
        avatar: 'https://i.pravatar.cc/150?img=2',
        shopName: 'KA Shop',
        isLive: true,
    },
    {
        id: '3',
        avatar: 'https://i.pravatar.cc/150?img=3',
        shopName: 'Beauty Store',
        isLive: false,
    },
];

const LIVE_STREAMS: LiveStreamData[] = [
    {
        id: '1',
        thumbnail: 'https://picsum.photos/300/400?random=1',
        viewerCount: 337,
        shopAvatar: 'https://i.pravatar.cc/150?img=10',
        shopName: 'Siêu Gợp Quận 8 (Ba...',
        productImage: 'https://picsum.photos/100/100?random=11',
        productName: 'ip 12promax 256GB zin nét ...',
        productPrice: 11800000,
    },
    {
        id: '2',
        thumbnail: 'https://picsum.photos/300/400?random=2',
        viewerCount: 1300,
        shopAvatar: 'https://i.pravatar.cc/150?img=11',
        shopName: 'Phượng Bạc Livestream',
        productImage: 'https://picsum.photos/100/100?random=12',
        productName: 'Kẹo dẻo xoài mười ốt cô nhà...',
        productPrice: 12999,
    },
    {
        id: '3',
        thumbnail: 'https://picsum.photos/300/400?random=3',
        viewerCount: 25,
        shopAvatar: 'https://i.pravatar.cc/150?img=12',
        shopName: 'Tổng kho giá rẻ',
        productImage: 'https://picsum.photos/100/100?random=13',
        productName: 'Điện thoại thông minh S24 với G...',
        productPrice: 1558888,
    },
    {
        id: '4',
        thumbnail: 'https://picsum.photos/300/400?random=4',
        viewerCount: 4300,
        shopAvatar: 'https://i.pravatar.cc/150?img=13',
        shopName: 'Tun Pham Official',
        productImage: 'https://picsum.photos/100/100?random=14',
        productName: '[TunPham97] Phấn nền Black...',
        productPrice: 224250,
    },
    {
        id: '5',
        thumbnail: 'https://picsum.photos/300/400?random=5',
        viewerCount: 892,
        shopAvatar: 'https://i.pravatar.cc/150?img=14',
        shopName: 'Tech Store VN',
        productImage: 'https://picsum.photos/100/100?random=15',
        productName: 'Tai nghe bluetooth cao cấp',
        productPrice: 899000,
    },
    {
        id: '6',
        thumbnail: 'https://picsum.photos/300/400?random=6',
        viewerCount: 156,
        shopAvatar: 'https://i.pravatar.cc/150?img=15',
        shopName: 'Fashion Hub',
        productImage: 'https://picsum.photos/100/100?random=16',
        productName: 'Áo thun nam cao cấp',
        productPrice: 299000,
    },
];

const LiveShoppingScreen = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const onPress = () => {
        router.push('/live-stream/room');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Mua sắm qua LIVE
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Following Channels */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.channelsContainer}
                    style={styles.channelsScroll}
                >
                    {FOLLOWING_CHANNELS.map((channel) => (
                        <FollowingChannelItem
                            key={channel.id}
                            avatar={channel.avatar}
                            shopName={channel.shopName}
                            isLive={channel.isLive}
                        />
                    ))}
                </ScrollView>

                {/* Voucher Banner */}
                <LiveVoucherBanner voucherValue="4,597Tr đ" />

                {/* Live Streams Grid */}
                <View style={styles.gridContainer}>
                    <LiveStreamGrid streams={LIVE_STREAMS} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    channelsScroll: {
        marginBottom: 16,
    },
    channelsContainer: {
        paddingHorizontal: 16,
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: 16,
        minHeight: 600,
    },
});

export default LiveShoppingScreen;

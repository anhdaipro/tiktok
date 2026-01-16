import VideoItem from '@/components/profile/video-item';
import useInfiniteVideos from '@/hooks/react-query/video/use-infinite-videos';
import { useProfileVideoStore } from '@/stores/video';
import { useVideoFeedStore } from '@/stores/video-feed-store';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { RefreshControl, View } from 'react-native';

interface TabViewVideoProps {
    userId: string;
    activeTab: string;
    isActive: boolean;
}

const TabViewVideo = ({
    userId,
    activeTab,
    isActive,
}: TabViewVideoProps) => {
    console.log('isActive', isActive)
    const params = React.useMemo(() => ({ userId, tab: activeTab, limit: 5 }), [userId, activeTab]);
    const { videos, isRefetching, isFetchingNextPage, fetchNextPage, hasNextPage, refetch: refetchVideos } = useInfiniteVideos({
        params,
        queryKey: ['profile-videos', userId, activeTab],
        enabled: !!userId && isActive,
    });
    const setVideoFeed = useVideoFeedStore((state) => state.setFeed);
    const setCurrentIndex = useProfileVideoStore(s => s.setCurrentIndex);
    const router = useRouter();
    const handleVideoPress = (index: number) => {
        // Lưu danh sách video và index vào store
        setCurrentIndex(index);
        setVideoFeed(['profile-videos', userId], params, index);
        router.push({
            pathname: '/video-feed',
        });
    };
    const renderVideo = useCallback(({ item, index }: { item: any, index: number }) => {
        return (
            <VideoItem item={item} onPress={() => handleVideoPress(index)} />
        )
    }, [handleVideoPress]);
    console.log('activeTab', activeTab, 'isActive', isActive)
    return (
        <View style={{ flex: 1 }}>
            <FlashList
                contentContainerStyle={{
                    paddingBottom: 8,
                }}
                data={videos}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetchVideos}
                    />
                }
                renderItem={renderVideo}
                numColumns={3}
                estimatedItemSize={150}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};

export default React.memo(TabViewVideo, (prev, next) => {
    return prev.userId === next.userId && prev.isActive === next.isActive;
});

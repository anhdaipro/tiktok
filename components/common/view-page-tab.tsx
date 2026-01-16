import { BOTTOM_TAB_HEIGHT } from '@/app/(tabs)/_layout';
import VideoItem from '@/components/common/video-item';
import { Colors } from '@/constants/theme';
import useInfiniteVideos from '@/hooks/react-query/video/use-infinite-videos';
import StorageManager from '@/native-modules/storage';
import { useHomeVideoStore } from '@/stores/video';
import { CommonFilters } from '@/types/api';
import { Video } from '@/types/video';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { setVideoCacheSizeAsync } from 'expo-video';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Dimensions, RefreshControl, StatusBar, View } from 'react-native';

interface TabViewVideoProps {
    activeTab: number;
    isActive: boolean;
}
const { height } = Dimensions.get('screen');
const TabViewPage = ({
    activeTab,
    isActive
}: TabViewVideoProps) => {
    const params: CommonFilters = {
        limit: 5,
        tab: activeTab.toString()
    }
    const {
        videos,
        fetchNextPage,
        hasNextPage,
        isRefetching,
        isFetchingNextPage,
        refetch: refetchVideos
    } = useInfiniteVideos({
        params,
        queryKey: ['videos', activeTab.toString()],
        enabled: isActive
    });
    const ITEM_HEIGHT = height - BOTTOM_TAB_HEIGHT;
    const setCurrentIndex = useHomeVideoStore(s => s.setCurrentIndex);
    const currentIndex = useHomeVideoStore(s => s.currentIndex);
    const isFocused = useIsFocused();

    // Set custom cache size toàn cục (tùy chọn, gọi 1 lần khi app start)
    useEffect(() => {
        const setVideoCacheSize = async () => {
            try {
                // Gọi hàm Native (Đây là hàm bất đồng bộ)
                const {
                    systemFree
                } = await StorageManager.getStorageStats();
                const freeCache = systemFree;
                const cacheSize = 500 * 1024 * 1024;// 500MB
                setVideoCacheSizeAsync(Math.min(freeCache, cacheSize));
            } catch (error) {
                console.error(error);
            }
        };
        setVideoCacheSize();
    }, []);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length === 0) return;
        const topItem = viewableItems[0];
        if (topItem?.index != null) {
            setCurrentIndex(topItem.index);
        }
    }).current;


    const renderVideo = useCallback(({ item, index }: { item: Video, index: number }) => {
        return (<VideoItem
            item={item}
            index={index}
            itemHeight={ITEM_HEIGHT}
            isActive={isActive && isFocused &&
                index === currentIndex} />);
    }, [isActive, isFocused, currentIndex, ITEM_HEIGHT]);

    // Xử lý sự kiện khi bắt đầu cuộn
    const handleScrollStart = () => {
        StatusBar.setBackgroundColor('transparent');
    };
    const flashListExtraData = useMemo(() => ({
        currentIndex,
        isFocused,
        isActive
    }), [currentIndex, isFocused, isActive]);

    // Xử lý sự kiện khi cuộn kết thúc
    const handleScrollEnd = () => {
        StatusBar.setBackgroundColor(Colors.static.black);
    };
    // const getItemLayout = useCallback(
    //     (data: ArrayLike<Video> | null | undefined, index: number) => ({
    //         length: ITEM_HEIGHT,
    //         offset: ITEM_HEIGHT * index,
    //         index,
    //     }),
    //     []
    // );
    // console.log('isActive', isActive, 'activeTab', activeTab)
    // if (!isActive) return <View style={{ flex: 1, backgroundColor: Colors.static.black }}>

    // </View>;
    return (
        <View style={{ flex: 1 }}>
            <FlashList
                // === Dữ liệu & Render ===
                // Nguồn dữ liệu cho danh sách, là một mảng các video.
                data={videos}
                // Hàm để render mỗi mục trong danh sách. `item` là một video, `index` là vị trí của nó.
                renderItem={renderVideo}
                // Hàm để trích xuất một key duy nhất cho mỗi mục, giúp React tối ưu hóa việc render.
                keyExtractor={item => item._id}
                // Force re-render khi currentIndex thay đổi
                extraData={flashListExtraData}
                snapToInterval={ITEM_HEIGHT}

                // === Hành vi cuộn ===
                // Khi true, FlatList sẽ dừng lại ở các "trang" có kích thước bằng chính nó. Rất quan trọng để tạo hiệu ứng lướt video.
                pagingEnabled
                // Ẩn thanh cuộn dọc.
                showsVerticalScrollIndicator={false}
                // Xác định tốc độ giảm tốc của cuộn sau khi người dùng thả tay. "fast" làm cho nó dừng lại nhanh hơn, phù hợp với pagingEnabled.
                decelerationRate="fast"
                snapToAlignment="start"
                disableIntervalMomentum

                // === Tải dữ liệu ===
                // Cung cấp chức năng "kéo để làm mới" (pull-to-refresh).
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetchVideos}
                    />
                }
                estimatedItemSize={ITEM_HEIGHT}

                // === Sự kiện cuộn ===
                // Được gọi khi người dùng bắt đầu kéo danh sách.
                onScrollBeginDrag={handleScrollStart}
                // Được gọi khi cuộn theo quán tính kết thúc (sau khi người dùng thả tay và danh sách tự trượt).
                onMomentumScrollEnd={handleScrollEnd}
                // Được gọi khi các mục hiển thị trong khung nhìn thay đổi. Dùng để xác định video nào đang active.
                onViewableItemsChanged={onViewableItemsChanged}
                // Cấu hình cho `onViewableItemsChanged`. `itemVisiblePercentThreshold: 80` nghĩa là một mục được coi là "hiển thị" khi ít nhất 80% của nó nằm trong màn hình.
                viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={1}
            />
        </View>
    );
};

export default React.memo(TabViewPage, (prev, next) => {
    return prev.isActive === next.isActive;
});

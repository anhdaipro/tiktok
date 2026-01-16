import VideoItem from '@/components/common/video-item';
import FPSDisplay from '@/components/fps-display';
import Header from '@/components/video-feed/heade';
import { Colors } from '@/constants/theme';
import useInfiniteVideos from '@/hooks/react-query/video/use-infinite-videos';
import { useVideoFeedVideoStore } from '@/stores/video';
import { useVideoFeedStore } from '@/stores/video-feed-store';
import { Video } from '@/types/video';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useRef } from 'react';
import { Dimensions, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
const { height } = Dimensions.get('screen');
const ITEM_HEIGHT = height - 10;
export default function VideoFeedScreen() {
  const isFocused = useIsFocused();
  const { initialIndex, queryKey, params } = useVideoFeedStore();
  const setCurrentIndex = useVideoFeedVideoStore((state) => state.setCurrentIndex);
  const currentIndex = useVideoFeedVideoStore((state) => state.currentIndex);
  const {
    videos,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isFetchingNextPage,
    refetch: refetchVideos
  } = useInfiniteVideos({
    params,
    queryKey: queryKey,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;

  const renderVideo = useCallback(({ item, index }: { item: Video; index: number }) => {
    return <VideoItem index={index} item={item} isActive={isFocused && index === currentIndex} itemHeight={ITEM_HEIGHT} />;
  }, [isFocused, currentIndex]);

  // Xử lý sự kiện khi bắt đầu cuộn
  const handleScrollStart = () => {
    StatusBar.setBackgroundColor('transparent');
  };

  // Xử lý sự kiện khi cuộn kết thúc
  const handleScrollEnd = () => {
    StatusBar.setBackgroundColor(Colors.static.black);
  };
  const flashListExtraData = useMemo(() => ({
    currentIndex,
    isFocused
  }), [currentIndex, isFocused]);


  // Nếu không có video nào trong store, không render gì cả (hoặc có thể quay lại)
  if (videos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <Header />
      <FPSDisplay />
      {/* 2. VIDEO FEED */}
      <FlashList
        extraData={flashListExtraData}
        // === Dữ liệu & Render ===
        // Nguồn dữ liệu cho danh sách, là một mảng các video.
        data={videos}
        // Hàm để render mỗi mục trong danh sách. `item` là một video, `index` là vị trí của nó.
        renderItem={renderVideo}
        // Hàm để trích xuất một key duy nhất cho mỗi mục, giúp React tối ưu hóa việc render.
        keyExtractor={item => item._id}

        // === Hành vi cuộn ===
        // Khi true, FlatList sẽ dừng lại ở các "trang" có kích thước bằng chính nó. Rất quan trọng để tạo hiệu ứng lướt video.
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        disableIntervalMomentum
        // Ẩn thanh cuộn dọc.
        showsVerticalScrollIndicator={false}
        // Xác định tốc độ giảm tốc của cuộn sau khi người dùng thả tay. "fast" làm cho nó dừng lại nhanh hơn, phù hợp với pagingEnabled.
        decelerationRate="fast"

        // === Hành vi cuộn ===
        // Khi true, FlatList sẽ dừng lại ở các "trang" có kích thước bằng chính nó. Rất quan trọng để tạo hiệu ứng lướt video.
        pagingEnabled
        // Ẩn thanh cuộn dọc.

        // Xác định tốc độ giảm tốc của cuộn sau khi người dùng thả tay. "fast" làm cho nó dừng lại nhanh hơn, phù hợp với pagingEnabled.

        // === Tải dữ liệu ===
        // Cung cấp chức năng "kéo để làm mới" (pull-to-refresh).
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchVideos}
          />
        }
        // re-render khi currentIndex thay đổi
        estimatedItemSize={ITEM_HEIGHT}
        initialScrollIndex={initialIndex}

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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.static.black,
  },
});
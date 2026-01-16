import { sortOptions } from '@/constants/comment';
import { KEY_COMMENTS } from '@/constants/key-query';
import { useBottomSheet } from '@/contexts/bottom-sheet-context';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import useInfiniteComments from '@/hooks/react-query/comment/use-infinite-comments';
import useQueryVideo from '@/hooks/react-query/video/use-query-video';
import { useAuthStore } from '@/stores/auth';
import { useCommentStore } from '@/stores/comment-store';
import { COMMENT_OBJECT_TYPE, TextComment } from '@/types/comment';
import {
  BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { ArrowUpDown, AtSign, Image as ImageIcon, Smile, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl, // Giữ RefreshControl
  StyleSheet,
  Text,
  TouchableOpacity, // Giữ TouchableOpacity,
  View // Giữ View cho các phần layout chung
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentItem } from '../common/comment-item';
import { DropMenu } from '../common/drop-menu'; // Import component DropMenu mới
import FlexBox from '../common/flex-box';
import CommentInputModal, { CommentInputHandle, extractMentionsFromValue, triggersConfig } from './popup-comment-input';

const { width: screenWidth } = Dimensions.get('window');

type SortByType = 'top' | 'newest';
export const CommentBottomSheet = () => {
  const objectType = COMMENT_OBJECT_TYPE.VIDEO
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { hideBottomSheet } = useBottomSheet();
  const insets = useSafeAreaInsets();
  const { showModal, hideModal } = useModal();
  const user = useAuthStore((state) => state.user);
  const images = useCommentStore(state => state.images);
  const value = useCommentStore(state => state.value);
  const [sortBy, setSortBy] = useState<SortByType>('top');
  const videoId = useCommentStore(state => state.videoId);
  const sortButtonRef = useRef<React.ComponentRef<typeof TouchableOpacity> | null>(null);
  const queryKey = useMemo(() => [KEY_COMMENTS, videoId, objectType, sortBy], [videoId, objectType, sortBy]);
  const params = useMemo(() => ({ relateId: videoId, objectType, limit: 10, sort: sortBy }), [videoId, objectType, sortBy]);

  // Lấy thông tin video mới nhất từ cache để cập nhật số lượng comment realtime
  const { data: videoDetail } = useQueryVideo(videoId);
  const displayCount = videoDetail?.countComment ?? 0;
  const commentRef = useRef<CommentInputHandle>(null);

  const { comments, isRefetching, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteComments(queryKey, params);
  console.log('comments', comments)

  const handleSelectSort = (type: any) => {
    setSortBy(type);
    hideModal();
    refetch();
  };
  const dataMention = useMemo(() => {
    const dataMentions = extractMentionsFromValue(value, triggersConfig);
    let text: TextComment[] = []
    for (const item of dataMentions) {
      text.push({
        text: item.text,
        type: item.data ? 'mention' : '',
        display: item.text
      })
    }
    return text
  }, [value]);


  const handleOpenCommentInput = () => {
    showModal({
      content: (
        <CommentInputModal
          onClose={hideModal}
          objectType={objectType}
          queryKey={queryKey}
          ref={commentRef}
          duration={300}
        />
      ),
      duration: 300,
      styleModalContent: { justifyContent: 'flex-end' },
      animationType: 'slide-bottom',
    });
  };

  const handleOpenSortMenu = useCallback(() => {
    sortButtonRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
      const top = py + height + 8;
      const right = screenWidth - (px + width);

      showModal({ // Sử dụng showModal từ modal-context
        content: (
          <DropMenu
            options={sortOptions}
            onSelect={(option) => handleSelectSort(option.value)}
            selectedValue={sortBy}
            onClose={hideModal} // Truyền hideModal để đóng modal khi chọn
            position={{ top, right }}
          />
        ),
        animationType: 'fade',
        // Đặt nền trong suốt để thấy được nội dung phía sau
        bgColor: 'transparent',
      });
    });
  }, [sortBy]);

  return (
    <>
      {/* Header */}
      <FlexBox direction="row" justify="center" align="center" style={styles.header}>
        <Text style={styles.headerTitle}>{displayCount} bình luận</Text>

        {/* Nút sắp xếp */}
        <TouchableOpacity
          ref={sortButtonRef}
          style={styles.sortButton}
          onPress={handleOpenSortMenu}
        >
          <ArrowUpDown size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={hideBottomSheet} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </FlexBox>

      {/* Danh sách comment - để BottomSheetFlatList chiếm phần giữa */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator style={{ marginTop: 20 }} />
        </View>
      ) : (
        <BottomSheetFlatList
          // === Dữ liệu & Render ===
          data={comments}
          renderItem={({ item }) => <CommentItem item={item} queryKeyParent={queryKey} />}
          keyExtractor={(item) => item._id}

          // === Tải dữ liệu (Kéo để làm mới & Cuộn vô hạn) ===
          refreshControl={
            // Component hiển thị khi người dùng kéo từ trên xuống để làm mới.
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          // Hàm được gọi khi người dùng cuộn đến gần cuối danh sách.
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          // Ngưỡng (từ 0 đến 1) để kích hoạt onEndReached. 0.5 nghĩa là khi 50% của mục cuối cùng hiển thị trên màn hình.
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            // Component hiển thị ở cuối danh sách, thường dùng cho chỉ báo "đang tải thêm...".
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
          }

          // === Tối ưu hóa & Giao diện ===
          // Ẩn thanh cuộn dọc.
          showsVerticalScrollIndicator={false}

          // (Android) Tắt hiệu ứng "vầng sáng" (overscroll glow). 'never' là để tắt hoàn toàn.
          overScrollMode="never"

          // === Tương tác với Bàn phím ===
          // Xác định xem bàn phím có nên đóng khi người dùng nhấn vào các phần tử khác không.
          // 'handled': Bàn phím không đóng khi nhấn vào các nút (TouchableOpacity) trong danh sách. Rất hữu ích!
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }} // Quan trọng: để FlatList chiếm không gian linh hoạt
          contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 16 }} // Tùy chọn: thêm padding dưới để tránh input che comment cuối
        />
      )}

      {/* Input - fixed ở dưới cùng */}
      <View
        style={[
          styles.inputWrapper,
          { paddingBottom: insets.bottom + 12 } // Thêm padding an toàn
        ]}
      >
        <FlexBox direction="row" align="center" gap={12} style={styles.inputContainer}>
          <Image
            source={{ uri: user?.avatar ?? 'https://i.imgur.com/dHy2fWw.png' }}
            style={styles.inputAvatar}
          />

          <TouchableOpacity onPress={handleOpenCommentInput} style={styles.input}>
            {images.length > 0 || value ? (<FlexBox direction="row" gap={8}>
              {images.length > 0 && <Text style={styles.textInput}>{`[ảnh]`}</Text>}
              <Text style={styles.commentTextContainer}>
                {dataMention.map(({ text, type, display }, index) => (
                  <Text key={index} style={[styles.commentText, { color: type == 'mention' ? colors.primary : colors.text }]}>{display}</Text>
                ))}
              </Text>

            </FlexBox>) : (
              <Text style={styles.textInput}>Thêm bình luận</Text>
            )}
            <FlexBox direction="row" gap={8} >
              <ImageIcon size={20} color={colors.textSecondary} />
              <Smile size={20} color={colors.textSecondary} />
              <AtSign size={20} color={colors.textSecondary} />
            </FlexBox>

          </TouchableOpacity>
        </FlexBox>
      </View>
    </>

  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
      position: 'relative',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
    sortButton: {
      position: 'absolute',
      right: 56, // Cách nút close 1 khoảng
      top: 16,
    },
    // XÓA listContainer hoàn toàn

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    inputWrapper: {
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    inputContainer: {
      padding: 12,
    },
    inputAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    input: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    textInput: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    commentTextContainer: {

    },
    commentText: {
      fontSize: 16,
      color: colors.text,
    },
  });

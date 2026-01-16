import { FormatHelper } from '@/common/helpers/format';
import FlexBox from '@/components/common/flex-box';
import Skeleton from '@/components/ui/skeleton';
import { KEY_COMMENTS } from '@/constants/key-query';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import useInfiniteComments from '@/hooks/react-query/comment/use-infinite-comments';
import { ActionType, useMutationActionComment } from '@/hooks/react-query/comment/use-mutation-action-comment';
import { useCommentStore } from '@/stores/comment-store';
import { Comment, COMMENT_OBJECT_TYPE } from '@/types/comment';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { ChevronDown, Heart, Play, ThumbsDown } from 'lucide-react-native';
import React, { memo, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommentInputModal, { CommentInputHandle } from '../comment/popup-comment-input';

interface CommentItemProps {
  item: Comment;
  queryKeyParent?: any
}

const CommentSkeleton = () => {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'flex-start' }}>
      <Skeleton width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
      <View style={{ flex: 1, gap: 6, justifyContent: 'center' }}>
        <Skeleton width={80} height={10} borderRadius={4} />
        <Skeleton width={160} height={10} borderRadius={4} />
      </View>
    </View>
  );
};
const LIMIT_REPLY = 4;

const CommentItemComponent: React.FC<CommentItemProps> = ({ item, queryKeyParent }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const parentId = item.parentId || item._id;
  const [isExpanded, setIsExpanded] = useState(false);
  const queryKey = useMemo(() => [KEY_COMMENTS, parentId, COMMENT_OBJECT_TYPE.VIDEO], [parentId]);
  const videoId = useCommentStore((state) => state.videoId);
  const queryKeyChoice = item.parentId ? queryKey : queryKeyParent
  const { mutate } = useMutationActionComment(queryKeyChoice);
  const enalbled = isExpanded && !item.parentId
  console.log('enalbled', enalbled)
  const params = useMemo(() => ({ relateId: videoId, objectType: COMMENT_OBJECT_TYPE.VIDEO, parentId, limit: LIMIT_REPLY }), [parentId, videoId]);
  const { comments: replies, isRefetching, isLoading: isLoadingReplies, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteComments(queryKey, params, enalbled);
  const { countReply } = item;
  const queryClient = useQueryClient();
  const handleLike = (action: ActionType) => {
    mutate({ commentId: item._id, action: action });
  };
  console.log('replies', replies);

  const { showModal, hideModal } = useModal();
  const commentRef = React.useRef<CommentInputHandle>(null);

  const handleSucess = () => {
    queryClient.setQueryData<{ pages: { data: Comment[] }[] }>(queryKeyParent, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          return {
            ...page,
            data: page.data.map((comment) => {
              if ((comment._id == item._id && !parentId) || (comment._id == parentId)) {
                return {
                  ...comment,
                  countReply: comment.countReply + 1,
                };
              }
              return comment;
            }),
          }
        }),
      };
    });
  }
  const handleReply = () => {
    showModal({
      content: (
        <CommentInputModal
          onClose={hideModal}
          onSuccess={handleSucess}
          objectType={COMMENT_OBJECT_TYPE.VIDEO}
          ref={commentRef}
          parentId={parentId}
          queryKey={queryKey}
          comment={item}
          duration={300}
        />
      ),
      duration: 300,
      styleModalContent: { justifyContent: 'flex-end' },
      animationType: 'slide-bottom',
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity>
          <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <FlexBox direction="row" align="center" gap={4}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            {item.replyTo ? (<>
              <Play fill={colors.textSecondary} size={10} color={colors.textSecondary} />
              <Text style={styles.authorName}>
                {item.replyTo.name}
              </Text>
            </>

            ) : null}
          </FlexBox>

          <Text style={styles.commentTextContainer}>
            {item.text.map(({ text, type, display }, index) => (
              <Text key={index} style={[styles.commentText, { color: type == 'mention' ? colors.primary : colors.text }]}>
                {type == 'mention' ? '@' : ''}{display}
              </Text>
            ))}
          </Text>

          {item.images.length > 0 && (
            <FlexBox direction="row" gap={8} style={{ marginTop: 8 }}>
              {item.images.map((image, index) => (
                <Image key={index} source={{ uri: image.secure_url }} style={styles.image} />
              ))}
            </FlexBox>
          )}

          <FlexBox direction="row" gap={16} align="center" justify="space-between" style={styles.footer}>
            <FlexBox direction="row" gap={4} align="center">
              <Text style={styles.time}>{FormatHelper.displayTime(item.createdAt)}</Text>
              <TouchableOpacity onPress={handleReply}>
                <Text style={styles.reply}>Trả lời</Text>
              </TouchableOpacity>
            </FlexBox>
            <FlexBox direction="row" gap={16} align="center">
              <FlexBox direction="row" gap={4} align='center'>
                <TouchableOpacity onPress={() => handleLike('like')}>
                  <Heart
                    size={20}
                    color={item.isLiked ? colors.primary : colors.textSecondary}
                    fill={item.isLiked ? colors.primary : 'transparent'}
                  />
                </TouchableOpacity>
                <Text style={styles.likeCount}>{item.countLike > 0 ? item.countLike : ''}</Text>
              </FlexBox>
              <FlexBox direction="row" gap={4} align='center'>
                <TouchableOpacity onPress={() => handleLike('dislike')} >
                  <ThumbsDown
                    size={20}
                    color={item.isDisliked ? colors.primary : colors.textSecondary}
                    fill={item.isDisliked ? colors.primary : 'transparent'}
                  />

                </TouchableOpacity>
              </FlexBox>
            </FlexBox>
          </FlexBox>

          {countReply > 0 && !isExpanded && (
            <TouchableOpacity style={styles.viewReplies} onPress={() => {
              setIsExpanded(true)
            }}>
              <View style={styles.line} />
              <Text style={styles.viewRepliesText}>Xem {countReply} câu trả lời</Text>
              <ChevronDown size={14} color={colors.textSecondary} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isExpanded && (
        <View style={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentItem key={reply._id} item={reply} />
          ))}
          {isLoadingReplies && (
            replies.length === 0 ? (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            ) : <CommentSkeleton />
          )}
          {!isFetchingNextPage && hasNextPage && (
            <TouchableOpacity onPress={() => fetchNextPage()} style={styles.viewReplies}>
              <View style={styles.line} />
              <Text style={styles.viewRepliesText}>Xem thêm {countReply - replies.length} câu trả lời</Text>
              <ChevronDown size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          {!hasNextPage && (<TouchableOpacity style={styles.viewReplies} onPress={() => setIsExpanded(false)}>
            <View style={styles.line} />
            <Text style={styles.viewRepliesText}>Ẩn</Text>
            <ChevronDown size={14} color={colors.textSecondary} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>)}
        </View>
      )}
    </View>
  );
};

export const CommentItem = memo(CommentItemComponent);

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',

      paddingVertical: 12,
      alignItems: 'flex-start',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
      backgroundColor: colors.surface,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    contentContainer: {
      flex: 1,
      marginRight: 8,
    },
    authorName: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 4,
    },
    commentTextContainer: {
      marginBottom: 4,
    },
    commentText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    footer: {
      marginTop: 4,
    },
    time: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    reply: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    viewReplies: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    },
    line: {
      width: 24,
      height: 1,
      backgroundColor: colors.textSecondary,
      marginRight: 12,
      opacity: 0.5,
    },
    viewRepliesText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      marginRight: 4,
    },
    repliesContainer: {
      paddingLeft: 44, // Thụt đầu dòng cho các câu trả lời con
    },
    actionContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 16,
      width: 30,
    },
    likeButton: {
      marginBottom: 2,
    },
    likeCount: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });
import Permissions from '@/common/helpers/permissions';
import { KEY_VIDEO } from '@/constants/key-query';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useMutationCreateComment } from '@/hooks/react-query/comment/use-mutation-create-comment';
import { useUploadFile } from '@/hooks/react-query/upload/use-upload-file';
import { useCommentStore } from '@/stores/comment-store';
import { Comment, COMMENT_OBJECT_TYPE, TextComment } from '@/types/comment';
import { User } from '@/types/user';
import { useQueryClient } from '@tanstack/react-query';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { parseValue, TriggersConfig, useMentions } from 'react-native-controlled-mentions';
import { Part } from 'react-native-controlled-mentions/dist/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuggestionList } from '../common/suggestion-list';
import { EmojiPicker } from './input/emoji-picker';
import { ImagePreview } from './input/image-preview';
import { InputToolbar } from './input/input-toolbar';

export function extractMentionsFromValue(value: string, triggersConfig: TriggersConfig<'mention' | 'hashtag'>): Part[] {
  const configs = Object.values(triggersConfig);
  const mentionState = parseValue(value, configs);
  return mentionState.parts
}

export const triggersConfig: TriggersConfig<'mention' | 'hashtag'> = {
  mention: {
    trigger: '@',
    textStyle: { fontWeight: 'bold', color: Colors.primary },
  },
  hashtag: {
    trigger: '#',
    textStyle: { fontWeight: 'bold', color: 'grey' },
  },
};
export interface CommentInputHandle {
  open: () => void;
  focus: () => void;
}

interface CommentInputModalProps {
  onClose: () => void;
  objectType: COMMENT_OBJECT_TYPE;
  duration?: number;
  comment?: Comment;
  onSuccess?: () => void;
  parentId?: string;
  queryKey: any;
}
const CommentInputModal = forwardRef<CommentInputHandle, CommentInputModalProps>(
  ({
    onClose,
    duration = 300,
    objectType,
    comment,
    onSuccess,
    parentId,
    queryKey,
  }, ref) => {
    const inputRef = useRef<TextInput>(null);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const relateId = useCommentStore((state) => state.videoId);
    useImperativeHandle(ref, () => ({
      open() {
        onClose();   // ví dụ toggle
      },
      focus() {
        inputRef.current?.focus();
      },
    }));
    const { images, setImages, value, setValue, videoId } = useCommentStore();

    // Tự động focus khi modal mở ra
    useEffect(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, duration); // Đợi 300ms cho animation slide-bottom hoàn tất
      return () => clearTimeout(timer);
    }, []);

    const queryClient = useQueryClient();
    const insets = useSafeAreaInsets();
    const callBackSuccess = () => {
      setValue('');
      setImages([]);
      onClose();
      queryClient.invalidateQueries({ queryKey: [KEY_VIDEO, videoId] });
      onSuccess?.();
    };

    const { mutate: createComment, isPending } = useMutationCreateComment(queryKey, callBackSuccess);
    const { textInputProps, triggers } = useMentions({
      value,
      onChange: setValue,
      triggersConfig,
    });
    const usersRef = React.useRef<Map<string, User>>(new Map());
    const { uploadAsync, isUploading } = useUploadFile();


    // --- Logic: Send Comment ---
    const handleSend = async () => {
      if (!value.trim() || isPending) return;
      const dataMentions = extractMentionsFromValue(value, triggersConfig);

      let mentions: string[] = [];
      let text: TextComment[] = []
      for (const item of dataMentions) {
        if (item.data) {
          mentions.push(item.data.id);
        }
        text.push({
          text: item.text,
          type: item.data ? 'mention' : '',
          display: item.data ? usersRef.current.get(item.data.id)?.username || item.text : item.text
        })
      }

      const imagesUpdate = await Promise.all(
        images.map(async (item) => {
          return uploadAsync({
            file: item,
            folder: 'comment',
            resourceType: 'image'
          })
        })
      )
      createComment(
        {
          relateId,
          objectType,
          text,
          mentions,
          parentId,
          replyTo: comment?.author._id,
          images: imagesUpdate,
          content: value
        }
      );

    };

    // --- Logic: Toolbar Actions ---
    const handleEmojiPress = (emoji: string) => {
      setValue((prev) => prev + emoji);
    };

    const handleAtPress = () => {
      setValue((prev) => prev + '@');
      // Focus input if not already focused
    };
    const saveUsers = (user: User) => {
      usersRef.current.set(user.id, user);
      setValue((prev) => prev + ` `);
    };
    const handlePickImages = async () => {
      // 1. Yêu cầu quyền truy cập thư viện ảnh bằng react-native-permissions
      const status = await Permissions.requestStoragePermission();
      if (!status) {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này. Vui lòng vào cài đặt để cấp quyền.'
        );
        return;
      }
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1, // chỉ chọn đủ số còn thiếu
      });

      if (result.didCancel) return;
      if (result.errorCode) return;

      const selected = result.assets || [];
      setImages(prev => [
        ...prev,
        ...selected.map(a => ({ uri: a.uri!, name: a.fileName!, type: a.type! }))
      ]);
    };



    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <SuggestionList {...triggers.mention} saveUsers={saveUsers} />
          {/* 1. Emoji Bar */}
          <EmojiPicker onEmojiPress={handleEmojiPress} />

          {/* 2. Input Area */}
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>

              <TextInput
                {...textInputProps}
                ref={inputRef}
                placeholderTextColor={colors.textSecondary}
                placeholder={comment ? `Trả lời ${comment?.author.name}` : 'Thêm bình luận...'}
                style={[styles.input, { padding: 8, paddingVertical: 4, fontSize: 16 }]}
              />
              <ImagePreview
                images={images}
                onRemove={(idx) => setImages(prev => prev.filter((_, i) => i !== idx))}
              />
            </View>
          </View>

          {/* 3. Toolbar Icons */}
          <InputToolbar
            onPickImages={handlePickImages}
            onAtPress={handleAtPress}
            onSend={handleSend}
            isPending={isPending}
            isUploading={isUploading}
            hasText={!!value.trim()}
          />
        </View>
      </KeyboardAvoidingView>

    );
  });

const createStyles = (colors: any) => StyleSheet.create({
  keyboardView: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  // Input
  inputRow: {
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
  },
  input: {
    fontSize: 15,
    color: colors.text,
    paddingTop: 0, // Fix alignment on Android
    paddingBottom: 0,
  },
});

export default CommentInputModal;

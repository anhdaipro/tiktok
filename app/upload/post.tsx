import HeaderNavigate from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import PostBottomBar from '@/components/upload-video/form/post-bottom-bar';
import PostDescription from '@/components/upload-video/form/post-description';
import PostSettings from '@/components/upload-video/form/post-settings';
import Preview from '@/components/upload-video/preview';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { useUploadFile } from '@/hooks/react-query/upload/use-upload-file';
import { useCreateVideo } from '@/hooks/react-query/video/use-create-video';
import { getLocalMusicPath } from '@/hooks/use-music-bakground';
import { showToast } from '@/services/toast';
import { useLoadingStore } from '@/stores/loading-store';
import { useUploadStore } from '@/stores/upload-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useVideoPlayer } from 'expo-video';
import React, { useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import { z } from 'zod';

const postSchema = z.object({
  caption: z.string().max(2200, "Mô tả quá dài"),
});

type PostFormData = z.infer<typeof postSchema>;

const { VideoCompressor } = NativeModules;

export default function TextToImagePostScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { type, mediaUri, music, thumbUri, textToImage, textStyle } = useUploadStore();
  const { showModal } = useModal();
  const inputRef = React.useRef<TextInput>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showLoading, hideLoading } = useLoadingStore();
  const { uploadAsync, isUploading } = useUploadFile();
  const { mutateAsync: createVideo } = useCreateVideo();
  const router = useRouter();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: '',
    },
  });
  const { control, handleSubmit, setValue, getValues } = form;
  const handlePublish = async (data: PostFormData) => {
    showLoading();

    try {
      let finalUrl = mediaUri;

      // 1️⃣ Merge music nếu là video
      if (music && type === 'video') {
        const localPath = getLocalMusicPath(music.id);
        const exists = await RNFS.exists(localPath);
        if (!exists) throw new Error('Local music file not found');
        console.log('localPath', localPath)
        console.log('mediaUri', mediaUri)
        try {
          finalUrl = await VideoCompressor.mergeAudioVideo(mediaUri, localPath);
          console.log('finalUrl', finalUrl)
        } catch (error) {
          console.error('Merge audio and video error:', error);
          throw new Error('Failed to merge audio and video');
        }
      }

      // 2️⃣ Upload Media
      let mediaCloudUrl = '';
      if (finalUrl) {
        const mediaFile = {
          uri: finalUrl,
          type: type === 'video' ? 'video/mp4' : 'image/jpeg',
          name: type === 'video' ? 'video.mp4' : 'image.jpg',
        };

        const mediaRes = await uploadAsync({
          file: mediaFile,
          folder: 'tiktok-clone/posts',
          resourceType: type === 'video' ? 'video' : 'image',
        });

        if (!mediaRes || !mediaRes.secure_url) throw new Error('Media upload failed');
        mediaCloudUrl = mediaRes.secure_url;
      } else {
        throw new Error('No media to upload');
      }

      // 3️⃣ Upload Thumbnail nếu video
      let thumbCloudUrl = '';
      if (type === 'video' && thumbUri) {
        const thumbFile = {
          uri: thumbUri,
          type: 'image/jpeg',
          name: 'thumbnail.jpg',
        };

        const thumbRes = await uploadAsync({
          file: thumbFile,
          folder: 'tiktok-clone/thumbnails',
          resourceType: 'image',
        });

        if (!thumbRes || !thumbRes.secure_url) throw new Error('Thumbnail upload failed');
        thumbCloudUrl = thumbRes.secure_url;
      }

      // 4️⃣ Tạo payload & gửi lên server
      const payload = {
        caption: data.caption,
        mediaUrl: mediaCloudUrl,
        thumbnailUrl: thumbCloudUrl || (type === 'image' ? mediaCloudUrl : ''),
        type: type,
        musicId: music?.id,
        ...(type === 'text' && {
          textToImage,
          textStyle,
        }),
      };
      console.log(payload)

      const createRes = await createVideo(payload);
      if (!createRes || createRes.error) throw new Error('Failed to create post on server');

      // 5️⃣ Thành công
      hideLoading();
      router.dismissAll(); // Hoặc navigate về home
      router.push('/(tabs)');

    } catch (error) {
      console.error('Publish error:', error);
      hideLoading();
      // Hiển thị toast lỗi cho người dùng
      showToast({
        type: 'danger',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      hideLoading();
    }
  };


  const player = useVideoPlayer(mediaUri ?? '', player => {
    player.loop = true;
    player.muted = true;
  });

  const openPreview = React.useCallback(() => {
    if (type === 'video') {
      player.muted = false;
      player.play();
    }
    showModal({
      content: (
        <Preview
        />
      ),
      bgColor: 'black',
      animationType: 'fade',
    });
  }, [type, player, showModal]);

  const onAppendText = (text: string) => {
    const current = getValues('caption');
    setValue('caption', current + text);
  };

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      <Controller
        control={control}
        name="caption"
        render={({ field: { value } }) => (
          <HeaderNavigate
            title={value.trim() ? 'Đăng' : ''}
            itemRight={isExpanded ? (
              <Button size='sm' variant='primary' onPress={handleSubmit(handlePublish)} disabled={isUploading}>
                <Text style={styles.postText}>Đăng</Text>
              </Button>
            ) : null}
          />
        )}
      />
      <FormProvider {...form}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
              <PostDescription
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                onAppendText={onAppendText}
                openPreview={openPreview}
              />
              {/* Settings List */}
              <PostSettings />

            </ScrollView>

            {/* Bottom Actions */}
            <PostBottomBar onPublish={handleSubmit(handlePublish)} isUploading={isUploading} />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </FormProvider>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: { flex: 1 },
  postText: {
    color: '#fff',
    fontWeight: '600'
  },
});

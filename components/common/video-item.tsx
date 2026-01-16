
import SpinningMusicDisc from '@/components/common/spinning-music-disc';
import { Colors } from '@/constants/theme';
import { useBottomSheet } from '@/contexts/bottom-sheet-context';
import { useTheme } from '@/contexts/theme-context';
import { ActionType, useMutationActionVideo } from '@/hooks/react-query/video/use-mutation-action-video';
import useQueryVideo from '@/hooks/react-query/video/use-query-video';
import { useCommentStore } from '@/stores/comment-store';
import { Video } from '@/types/video';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoPlayer, VideoSource, VideoView } from 'expo-video';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Music,
  Plus,
  Share2
} from 'lucide-react-native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CommentBottomSheet } from '../comment/comment-bottom-sheet';
import FlexBox from './flex-box';
import PlayerControl from './player-control';
import { VideoSlider } from './video-slider';
const { width, height } = Dimensions.get('window');

const SIZE_ICON_PLAY = 52
const getVideoSource = (uri: string): VideoSource => ({
  uri,
  useCaching: true,

});
interface Props {
  item: Video
  isActive: boolean
  itemHeight?: number
  index: number;
}
const VideoItem = memo(({
  item,
  isActive,
  index,
  itemHeight = height
}: Props) => {

  const { mutate: actionVideo } = useMutationActionVideo();
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  const timeInterval = () => {
    const time = Math.ceil(item.duration / 60)
    return Math.min(time * 0.1, 1)
  }

  const { data } = useQueryVideo(item._id);

  const {
    countComment = 0,
    countLike = 0,
    countSave = 0,
    countShare = 0,
    isLiked = false,
    isSaved = false,
    isShared = false,
    author,
  } = data || {};

  const {
    music,
    videoUrl,
    tags,
    duration,
  } = item

  const videoSource = useMemo(() => getVideoSource(videoUrl), [videoUrl]);
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.timeUpdateEventInterval = timeInterval();
  });

  const { showBottomSheet } = useBottomSheet();

  React.useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [isActive]);

  const handleActionVideo = (action: ActionType) => {
    actionVideo({ videoId: item._id, action: action });
  };


  const setVideoId = useCommentStore((state) => state.setVideoId);
  const handleOpenComments = () => {
    setVideoId(item._id);
    showBottomSheet(
      <CommentBottomSheet />,
      ['60%'] // Chỉ cho phép một điểm neo duy nhất (cao nhất) để chặn kéo lên
    );
  };


  return (
    <View style={[styles.videoContainer, { height: itemHeight }]} >
      {/* 1. LỚP VIDEO NỀN */}
      {/* Bọc VideoView và Gradient trong Pressable để xử lý play/pause */}

      {player && (
        <VideoView

          player={player}
          style={[styles.backgroundVideo, { height: itemHeight }]}
          nativeControls={false} // Tắt các nút điều khiển mặc định
        />
      )}

      {/* 2. LỚP PHỦ ĐEN MỜ (Để chữ trắng dễ đọc) */}

      <PlayerControl
        player={player}
      />

      {/* 3. THANH BÊN PHẢI (Right Sidebar) */}
      <View style={styles.rightContainer}>
        {/* Avatar */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: author?.avatar }} style={styles.avatar} />

          <View style={styles.plusIconContainer}>
            <Plus color={colors.white} size={14} strokeWidth={3} />
          </View>
        </View>
        <FlexBox gap={8}>
          {/* Action Buttons */}
          <TouchableOpacity style={styles.iconButton} onPress={() => handleActionVideo('like')}>
            <Heart
              size={24}
              color={isLiked ? Colors.primary : colors.white}
              fill={isLiked ? Colors.primary : 'transparent'}
            />
            <Text style={styles.iconLabel}>{countLike}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleOpenComments}>
            <MessageCircle
              size={24}
              color={colors.white}
            />
            <Text style={styles.iconLabel}>{countComment}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => handleActionVideo('save')}>
            <Bookmark
              size={24}
              color={isSaved ? Colors.primary : colors.white}
              fill={isSaved ? colors.primary : 'transparent'}
            />
            <Text style={styles.iconLabel}>{countSave ?? 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => handleActionVideo('share')}>
            <Share2 size={24} color={Colors.static.white} fill={isShared ? colors.primary : 'transparent'} />
            <Text style={styles.iconLabel}>{countShare}</Text>
          </TouchableOpacity>

          {/* Music Disc Animation */}
          {music && (
            <SpinningMusicDisc imageUrl={music.secure_url} isPlaying={isActive} />
          )}
        </FlexBox>
      </View>

      {/* 4. THÔNG TIN BÊN DƯỚI (Bottom Info) */}
      <View style={styles.bottomContainer}>
        {/* Popup gợi ý (như trong ảnh) */}
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>Người mà bạn có thể biết</Text>
        </View>

        <Text style={[styles.username, styles.textShadow]}>{author?.name}</Text>
        <Text ellipsizeMode="tail" style={[styles.description, styles.textShadow]} numberOfLines={2}>
          {item.caption}
        </Text>
        <FlexBox direction='row' gap={4} align='center'>
          {tags.map((tag) => (
            <Text key={tag} style={[styles.description, styles.textShadow]}>
              #{tag}
            </Text>
          ))}
        </FlexBox>
        <Progress player={player} duration={duration} isActive={isActive} />

        {music ?
          <View style={styles.musicRow}>
            <Music size={14} color={colors.background} style={styles.musicIcon} />
            <Text style={[styles.musicText, styles.textShadow]}>{music.name}</Text>
          </View> : null}
        {/* 5. SLIDER (Đã tách component) */}
        <VideoSlider
          player={player}
          duration={duration}
          timeInterval={timeInterval() * 1000}
          isActive={isActive}
        />
      </View>
    </View>
  );
});
interface VideoSliderProps {
  duration: number;
  isActive: boolean;
  player: VideoPlayer;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Progress = ({ player, duration, isActive }: VideoSliderProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);
  useEffect(() => {

    if (!isActive) return;
    const sub = player.addListener('timeUpdate', (e) => {
      // Chỉ update progress nếu không đang tua (sliding)
      // Tuy nhiên ở đây ta update trực tiếp, gesture sẽ override khi kéo
      setCurrentTime(e.currentTime);
    });

    return () => sub.remove();
  }, [duration, isActive]);
  return (
    <FlexBox align='center' direction='row' gap={8}>
      <Text style={styles.textTime}>{formatTime(currentTime)}</Text>
      <Text style={styles.textTime}>/</Text>
      <Text style={styles.textTime}>{formatTime(duration)}</Text>
    </FlexBox>
  );
};
const createThemedStyles = (colors: any) => StyleSheet.create({
  videoContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.static.black,
    position: 'relative',
  },
  textTime: {
    color: colors.text,
    fontSize: 12,
  },
  backgroundVideo: {
    width: width,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

  },
  pauseIcon: {
    position: 'absolute',
    left: width / 2 - SIZE_ICON_PLAY / 2,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // === RIGHT SIDEBAR ===
  rightContainer: {
    position: 'absolute',
    right: 8,
    bottom: 40, // Cách đáy một chút để tránh thông tin bài hát
    alignItems: 'center',
  },
  profileContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconLabel: {
    color: Colors.static.white,
    fontSize: 12,
    fontWeight: '600',

  },

  // === BOTTOM INFO ===
  bottomContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
  },
  suggestionBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  suggestionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  username: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  description: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,


  },
  textShadow: { textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicIcon: {
    marginRight: 8,
  },
  musicText: {
    color: colors.white,
    fontSize: 14,
  },
});


export default memo(VideoItem, (prev, next) => {
  // Re-render nếu item hoặc isActive thay đổi
  return (
    prev.item._id === next.item._id &&
    prev.isActive === next.isActive
  );
});
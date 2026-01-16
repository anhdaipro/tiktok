import { useTheme } from '@/contexts/theme-context';
import { useUploadStore } from '@/stores/upload-store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Check, X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { mediaUri, type } = useUploadStore();

  // Video player setup
  const player = useVideoPlayer(
    type === 'video' && mediaUri ? { uri: mediaUri } : null,
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  const handleDiscard = () => {
    router.back();
  };

  const handleNextStep = () => {
    router.push('/upload/post');
  };

  const handleTogglePlayPause = () => {
    if (player) {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  if (!mediaUri) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {type === 'image' ? (
        <Image source={{ uri: `file://${mediaUri}` }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <Pressable onPress={handleTogglePlayPause} style={StyleSheet.absoluteFill}>
          {player && (
            <VideoView
              player={player}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              nativeControls={false}
            />
          )}
        </Pressable>
      )}

      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleDiscard}>
          <X color={colors.white} size={28} />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleNextStep}>
          <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
            <Check size={24} color={colors.white} />
          </View>
          <Text style={styles.effectText}>Tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20 },
  uploadButton: { alignItems: 'center' },
  uploadIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginBottom: 4 },
  effectText: { color: colors.white, fontSize: 13, fontWeight: '600', marginTop: 4 },
});

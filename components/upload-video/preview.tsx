import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { useUploadStore } from '@/stores/upload-store';
import { useVideoPlayer, VideoView } from 'expo-video';
import { X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Preview = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { type, textToImage, textStyle, mediaUri, thumbUri } = useUploadStore();
  const { hideModal } = useModal();

  const player = useVideoPlayer(mediaUri ?? '', player => {
    player.loop = true;
    player.muted = true;
  });

  const closePreview = () => {
    if (type === 'video') {
      player.pause();
      player.currentTime = 0;
      player.muted = true;
    }
    hideModal();
  };
  const renderItemPreview = () =>{
    let item = null
    if (type === 'video') {
      item =<VideoView style={styles.fullScreenPreview} player={player} nativeControls />
    }else if(type === 'text'){
      item =<View style={[styles.fullScreenPreview, { backgroundColor: textStyle?.bg }]}>
        <Text style={[styles.fullScreenText, { color: textStyle?.color }]}>{textToImage}</Text>
      </View>
    }else{
      item =<Image source={{ uri: `file://${mediaUri}` }} style={styles.fullScreenPreview} resizeMode="contain" />
    }
    return item
  }
  return (
    <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
                <X size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
                {renderItemPreview()}
            </View>
        </View>
  )
}
export default Preview
const createStyles = (colors: any) => StyleSheet.create({
   modalContainer: { flex: 1, backgroundColor: 'black' },
    closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 },
    modalContent: { flex: 1, justifyContent: 'center' },
    fullScreenPreview: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    fullScreenText: { fontSize: 32, fontWeight: 'bold' },
});
import { MusicTrack } from "@/components/upload-video/camera-record";
import { useLoadingStore } from "@/stores/loading-store";
import { useUploadStore } from "@/stores/upload-store";
import { useMusicStore } from "@/stores/use-music";
import Sound from "react-native-sound";
import { preloadMusicInBackground, removeCachedMusic } from "./use-music-bakground";


// Singleton global sound instance
let globalSound: Sound | null = null;
let globalIsLoaded = false;

const useSound = () => {
  const muisicUri = useMusicStore((state) => state.uri);
  const setUri = useMusicStore((state) => state.setUri);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const setIsPlaying = useMusicStore((state) => state.setIsPlaying);

  const musicCurent = useUploadStore((state) => state.music);
  const setUploadData = useUploadStore((state) => state.setUploadData);

  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  const play = () => {
    if (globalSound && globalIsLoaded) {
      globalSound.play((success) => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handlePlay = (music: MusicTrack) => {
    const { url } = music
    if (url === muisicUri) {
      toogle();
      return;
    }
    //stop nhạc cũ nếu có
    if (globalSound) {
      globalSound.stop(() => {
        globalSound?.release();
      });
    }
    showLoading();
    if (musicCurent) {
      removeCachedMusic(musicCurent.id);
    }

    globalSound = new Sound(url, undefined, (error) => {
      if (error) {
        hideLoading();
        console.error('Lỗi load sound:', error);
        return;
      }
      hideLoading();
      globalIsLoaded = true;
      setUri(url);
      setUploadData({ music });
      play(); // play ngay khi đã load xong
      preloadMusicInBackground(music, {
        onProgress: (p) => console.log('Music preload:', p, '%'),
        onDone: (path) => console.log('Music cached at:', path),
      });
    });
  };

  const toogle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  const pause = () => {
    if (globalSound) {
      globalSound.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (globalSound) {
      globalSound.stop();
      setIsPlaying(false);
    }
  };

  return { play, stop, isPlaying, pause, toogle, handlePlay };
};
export default useSound;
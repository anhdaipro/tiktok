import { MusicTrack } from '@/components/upload-video/camera-record';
import RNFS from 'react-native-fs';

export const getLocalMusicPath = (musicId: string | number) => {
  return `${RNFS.CachesDirectoryPath}/music_${musicId}.mp4`;
};
type PreloadMusicOptions = {
  onProgress?: (percent: number) => void;
  onDone?: (localPath: string) => void;
  onError?: (err: any) => void;
};
export const removeCachedMusic = async (musicId: string | number) => {
  const localPath = getLocalMusicPath(musicId);
  try {
    const exists = await RNFS.exists(localPath);
    if (exists) {
      await RNFS.unlink(localPath); // xóa file
      console.log(`Deleted cached music: ${localPath}`);
      return true;
    } else {
      console.log(`No cached file found for music ${musicId}`);
      return false;
    }
  } catch (err) {
    console.error('Failed to delete cached music', err);
    return false;
  }
};

export const preloadMusicInBackground = async (
  music: MusicTrack,
  options?: PreloadMusicOptions
) => {
  const localPath = getLocalMusicPath(music.id);

  try {
    const exists = await RNFS.exists(localPath);
    if (exists) {
      options?.onDone?.(localPath);
      return localPath;
    }

    // ❗ KHÔNG await download.promise
    const download = RNFS.downloadFile({
      fromUrl: music.url,
      toFile: localPath,
      background: true,       // chạy nền
      discretionary: true,    // iOS tối ưu theo hệ thống
      progressDivider: 5,
      progress: (res) => {
        if (res.contentLength > 0) {
          const percent = Math.floor(
            (res.bytesWritten / res.contentLength) * 100
          );
          options?.onProgress?.(percent);
        }
      },
    });

    download.promise
      .then(() => {
        options?.onDone?.(localPath);
      })
      .catch(options?.onError);

    return localPath;
  } catch (err) {
    options?.onError?.(err);
    throw err;
  }
};
import FuncHelper from '@/common/helpers/func-help';
import { useBottomSheet } from '@/contexts/bottom-sheet-context';
import { useTheme } from '@/contexts/theme-context';
import { useAppState } from '@/hooks/use-app-state';
import { useUploadStore } from '@/stores/upload-store';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { ChevronDown, Image as ImageIcon, Music, RotateCcw, Smile, Timer, Wand2, X, Zap } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, NativeModules, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission, VideoFile } from 'react-native-vision-camera';
import CircleProgress from '../ui/circle-progress';
import MusicSheet from './music-sheet';

export interface MusicTrack {
  id: string;
  title: string;
  author: string;
  url: string;
  duration: number;
  cover?: string;
}

const CAMERA_MODES = [
  { key: '10m', label: '10 phút', duration: 600 },
  { key: '60s', label: '60s', duration: 60 },
  { key: '15s', label: '15s', duration: 15 },
  { key: 'photo', label: 'ẢNH', duration: 0 },
  { key: 'text', label: 'Văn bản', duration: 0 },
];


const { VideoCompressor } = NativeModules;


export default function CameraRecorder() {
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<Camera>(null);
  const [recording, setRecording] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showBottomSheet, hideBottomSheet } = useBottomSheet();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [selectedMode, setSelectedMode] = useState('15s');
  const timerRef = useRef<any>(null);
  const [countdownMode, setCountdownMode] = useState<0 | 3 | 10>(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);
  const setData = useUploadStore((state) => state.setUploadData);
  const reset = useUploadStore((state) => state.reset);
  const musicSelected = useUploadStore((state) => state.music);
  const [appActive, setAppActive] = useState(true);

  useAppState((state) => {
    console.log('state', state);
    setAppActive(state === 'active');
  });
  console.log('appActive', appActive);
  const isFocused = useIsFocused();
  const isCameraActive = isFocused && appActive;
  console.log('isCameraActive', isCameraActive);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // 1️⃣ Gọi hideBottomSheet để đóng sheet
      hideBottomSheet();
      reset();
      // 2️⃣ Nếu muốn ngăn pop, uncomment
      // e.preventDefault();
    });

    return unsubscribe;
  }, [navigation, hideBottomSheet]);
  console.log()
  // 1. Hook xin quyền
  const { hasPermission: hasCamPermission, requestPermission: requestCamPermission } = useCameraPermission();
  const { hasPermission: hasMicPermission, requestPermission: requestMicPermission } = useMicrophonePermission();

  React.useEffect(() => {
    if (!hasCamPermission) requestCamPermission();
    if (!hasMicPermission) requestMicPermission();
  }, []);

  const handleOpenMusic = () => {
    setAppActive(false);
    showBottomSheet(
      <MusicSheet
        setAppActive={setAppActive}
      />,
      ['90%']
    );
  };

  const toggleTimer = () => {
    setCountdownMode((prev) => {
      if (prev === 0) return 3;
      if (prev === 3) return 10;
      return 0;
    });
  };

  const handleCapture = () => {
    if (recording) {
      stopRecording();
      return;
    }

    if (countdownMode > 0) {
      setCount(countdownMode);
      setIsCountingDown(true);
      let currentCount = countdownMode;
      const interval = setInterval(() => {
        currentCount -= 1;
        setCount(currentCount);
        if (currentCount === 0) {
          clearInterval(interval);
          setIsCountingDown(false);
          performCapture();
        }
      }, 1000);
      timerRef.current = interval;
    } else {
      performCapture();
    }
  };
  const heandleChoiceSelect = (mode: string) => {
    if (mode == 'text') {
      router.push('/upload/upload-text');
    }
    setSelectedMode(mode);
  }

  const performCapture = () => {
    if (selectedMode === 'photo') {
      takePhoto();
    } else {
      startRecording();
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: flash
      });
      // setTempVideoUri(photo.path);
      setData({
        type: 'image',
        mediaUri: photo.path,
        caption: ''
      });
      router.push('/upload/preview');
    } catch (e) {
      console.error("Photo capture failed:", e);
    }
  };
  const handleFinish = async (videoFile: VideoFile) => {
    try {
      // 1. Nén video
      const compressedUri = await FuncHelper.compressVideo(videoFile.path);
      let finalUri = compressedUri;
      // setTempVideoUri(finalUri);
      let thumbPath = undefined;
      // Tạo thumbnail từ video
      try {
        const thumb = await createThumbnail({ url: finalUri, timeStamp: 100 });
        // setThumbUri(thumb.path);
        thumbPath = thumb.path;
      } catch (err) {
        console.log('Error creating thumbnail:', err);
      }
      setData({
        type: 'video',
        mediaUri: finalUri,
        thumbUri: thumbPath,
        caption: ''
      });
      router.push('/upload/preview');
    } catch (error) {
      console.error("Processing failed:", error);
      // setTempVideoUri(videoFile.path); // Fallback
    }
    setRecording(false);
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;
    try {
      setRecording(true);
      startTimeRef.current = Date.now();
      setProgress(0);
      const duration = CAMERA_MODES.find(m => m.key === selectedMode)?.duration || 15;
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const p = Math.min((elapsed / (duration * 1000)) * 100, 100);
        setProgress(p);
      }, 100);

      timerRef.current = setTimeout(() => {
        stopRecording();
      }, duration * 1000);

      cameraRef.current.startRecording({
        flash: flash,
        onRecordingFinished: (video) => handleFinish(video),
        onRecordingError: (e) => {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          if (e.code === 'capture/no-data') {
            setRecording(false);
            return;
          }
          console.error(e);
          setRecording(false);
        },
      });
    } catch (e) {
      console.log(e)
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    if (isCountingDown) {
      clearInterval(timerRef.current);
      setIsCountingDown(false);
      return;
    }

    const minDuration = 1000;
    const elapsed = Date.now() - startTimeRef.current;
    if (elapsed < minDuration) {
      setTimeout(stopRecording, minDuration - elapsed);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    try {
      await cameraRef.current?.stopRecording();
    } catch (e) {
      console.log('Stop recording error:', e);
    }
    stop();
    setRecording(false);
    setProgress(0);
  };

  // 2. Giao diện khi chưa có quyền
  if (!hasCamPermission || !hasMicPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Cần quyền truy cập Camera và Microphone để quay video.</Text>
        <TouchableOpacity onPress={Linking.openSettings} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Mở Cài đặt</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) return <View style={styles.container}><ActivityIndicator color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        video={selectedMode !== 'photo'}
        audio={selectedMode !== 'photo'}
        photo={selectedMode === 'photo'}
      />

      {/* Top Bar */}
      <View style={[styles.topBar, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <X color={colors.white} size={28} />
        </TouchableOpacity>

        {!recording && (
          <TouchableOpacity style={styles.addMusicButton} onPress={handleOpenMusic}>
            <Music size={14} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.addMusicText} numberOfLines={1}>
              {musicSelected ? musicSelected.title : "Thêm âm thanh"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setCameraPosition(p => p === 'back' ? 'front' : 'back')}>
          <RotateCcw color={colors.white} size={28} />
          <Text style={styles.iconLabel}>Lật</Text>
        </TouchableOpacity>
      </View>

      {/* Right Sidebar */}
      <View style={[styles.rightSidebar, { top: insets.top + 80 }]}>
        <TouchableOpacity style={styles.sidebarItem}>
          <Timer size={24} color={colors.white} />
          <Text style={styles.iconLabel}>Tốc độ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Wand2 size={24} color={colors.white} />
          <Text style={styles.iconLabel}>Làm đẹp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <View style={styles.filterIcon}>
            <View style={[styles.filterCircle, { backgroundColor: '#FF4040' }]} />
            <View style={[styles.filterCircle, { backgroundColor: '#40E0D0', left: 6 }]} />
            <View style={[styles.filterCircle, { backgroundColor: '#FFD700', top: -4, left: 3 }]} />
          </View>
          <Text style={styles.iconLabel}>Bộ lọc</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={toggleTimer}>
          <Timer size={24} color={colors.white} />
          <Text style={styles.iconLabel}>{countdownMode > 0 ? `${countdownMode}s` : 'Hẹn giờ'}</Text>
          {countdownMode > 0 && <View style={styles.activeDot} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}>
          <Zap size={24} color={flash === 'on' ? colors.primary : colors.white} fill={flash === 'on' ? colors.primary : 'transparent'} />
          <Text style={styles.iconLabel}>Đèn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <ChevronDown size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Countdown Overlay */}
      {isCountingDown && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{count}</Text>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20 }]}>
        {/* Duration Selector */}
        {!recording && (
          <View style={styles.durationSelector}>
            {CAMERA_MODES.map((mode) => (
              <TouchableOpacity key={mode.key} onPress={() => heandleChoiceSelect(mode.key)}>
                <Text style={[styles.durationText, selectedMode === mode.key && styles.activeDuration]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.recordRow}>
          <TouchableOpacity style={styles.effectButton}>
            <Smile size={32} color={colors.white} />
            <Text style={styles.effectText}>Hiệu ứng</Text>
          </TouchableOpacity>

          <View style={styles.recordButtonWrapper}>
            {recording && (
              <CircleProgress progress={progress} style={{ position: 'absolute' }} size={96} stroke={6} color={colors.primary} />
            )}
            <TouchableOpacity
              style={[styles.recordButtonOuter, recording && styles.recordingOuter]}
              onPress={isCountingDown ? stopRecording : handleCapture}
            >
              <View style={[
                styles.recordButtonInner,
                recording && styles.recordingInner,
                selectedMode === 'photo' && styles.photoButtonInner
              ]} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.uploadButton}>
            <View style={styles.uploadIconContainer}>
              <ImageIcon size={24} color={colors.white} />
            </View>
            <Text style={styles.effectText}>Tải lên</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 20 },
  permissionText: { color: colors.text, textAlign: 'center', marginBottom: 20, fontSize: 16 },
  permissionButton: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  permissionButtonText: { color: colors.white, fontWeight: 'bold' },
  // Top Bar
  topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 },
  addMusicButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addMusicText: { color: colors.white, fontWeight: '600', fontSize: 15, maxWidth: 150 },

  // Sidebar
  rightSidebar: { position: 'absolute', right: 16, alignItems: 'center', gap: 20, zIndex: 10 },
  sidebarItem: { alignItems: 'center' },
  iconLabel: { color: colors.white, fontSize: 10, marginTop: 4, fontWeight: '500' },
  filterIcon: { width: 24, height: 24, position: 'relative' },
  filterCircle: { width: 12, height: 12, borderRadius: 6, position: 'absolute', opacity: 0.8 },

  // Bottom Controls
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'flex-end' },
  durationSelector: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  durationText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 },
  activeDuration: { color: colors.white, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },

  recordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 40 },
  recordButtonOuter: {
    width: 80,
    height: 80, borderRadius: 40,
    borderWidth: 6, borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  recordingOuter: {
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 48,
    borderWidth: 0,
    transform: [{ scale: 1.2 }]
  },
  recordButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary },
  recordingInner: { width: 30, height: 30, borderRadius: 6, backgroundColor: colors.primary },
  photoButtonInner: { backgroundColor: colors.white, borderWidth: 4, borderColor: 'rgba(0,0,0,0.1)' },

  effectButton: { alignItems: 'center' },
  uploadButton: { alignItems: 'center' },
  uploadIconContainer: { width: 32, height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.white, marginBottom: 4 },
  effectText: { color: colors.white, fontSize: 11, fontWeight: '600', marginTop: 4 },

  activeDot: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  countdownOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 20 },
  countdownText: { fontSize: 100, fontWeight: 'bold', color: colors.white },
  recordButtonWrapper: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingContainer: {
    position: 'absolute',
    width: 96,
    height: 96,
  },
});

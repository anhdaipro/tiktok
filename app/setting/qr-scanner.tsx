import Permissions from '@/common/helpers/permissions';
import FlexBox from '@/components/common/flex-box';
import HeaderNavigate from '@/components/layout/header';
import { ScannerFrame } from '@/components/qr-scanner/scanner-frame';
import { CameraNotFoundView, PermissionView, ProcessingOverlay } from '@/components/qr-scanner/scanner-views';
import StatusBarCustom from '@/components/ui/status-bar';
import { Colors } from '@/constants/theme';
import { useAppState } from '@/hooks/use-app-state';
import { scanQRFromImage } from '@/native-modules/qr-scan';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Image as ImageIcon, QrCode, Zap } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner, } from 'react-native-vision-camera';

const FRAME_SIZE = 250;
const CORNER_SIZE = 30;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const HEIGHT_HEADER = 56;
const BOTTOM_BAR_HEIGHT = 90; // Ước tính chiều cao của bottom bar (paddingVertical: 20 + paddingBottom: 30 + content)


export default function QRCodeScannerScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dY, setdY] = useState(0);
  const isFocused = useIsFocused()
  const device = useCameraDevice('back');
  const requestCameraPermission = useCallback(async () => {
    const status = await Permissions.requestCameraPermission();
    setHasPermission(status);
  }, []);

  useAppState((state) => {
    if (state === 'active') {
      requestCameraPermission();
      setIsScanningActive(true);
    }
  });

  // 1. Xử lý quyền truy cập Camera
  useEffect(() => {
    requestCameraPermission();
  }, []);
  const insets = useSafeAreaInsets();

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, y, width, x } = event.nativeEvent.layout;
    console.log('height', height, y, width, x)
    setdY(y)
  }, []);

  // Tính toán vùng quét hợp lệ trên màn hình
  const scanRegion = useMemo(() => {
    const headerHeight = HEIGHT_HEADER + insets.top;
    const frameX = (screenWidth - FRAME_SIZE) / 2;
    // Căn giữa toàn bộ khối nội dung (khung quét + nút flash + text) trong không gian có sẵn.
    // frameY là vị trí bắt đầu của khối nội dung này.
    const frameY = headerHeight + dY;
    console.log('frameY', frameY)
    return {
      x: frameX,
      y: frameY,
      width: FRAME_SIZE,
      height: FRAME_SIZE,
    };
  }, [insets.top, dY]);

  // Hàm kiểm tra xem mã QR có nằm trong khung không
  const isCodeInFrame = (codeFrame: any) => {
    if (!codeFrame) return false;
    // So sánh tọa độ của mã QR với vùng quét đã tính toán
    return (
      codeFrame.x >= scanRegion.x &&
      codeFrame.y >= scanRegion.y &&
      codeFrame.x + codeFrame.width <= scanRegion.x + scanRegion.width &&
      codeFrame.y + codeFrame.height <= scanRegion.y + scanRegion.height
    );
  };

  // Hàm xử lý chung khi quét được giá trị
  const handleScannedValue = (scannedValue: string) => {
    setIsScanningActive(false); // Dừng quét
    router.dismiss();
    router.push({
      pathname: '/setting/scanned-result',
      params: { scannedValue },
    });
  };

  // Hàm mở thư viện và quét ảnh
  const handleOpenLibrary = async () => {
    // 1. Yêu cầu quyền truy cập thư viện ảnh bằng react-native-permissions
    setIsScanningActive(false);
    const status = await Permissions.requestStoragePermission();
    if (!status) {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này. Vui lòng vào cài đặt để cấp quyền.'
      );
      setIsScanningActive(true);
      return;
    }
    try {
      // 2. Mở thư viện ảnh bằng react-native-image-picker
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) {
        setIsScanningActive(true);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // Bắt đầu quét QR từ ảnh vừa chọn
        setIsProcessing(true);
        const results = await scanQRFromImage(imageUri);
        if (results.length === 0) {
          Alert.alert('Thông báo', 'Không tìm thấy mã QR trong ảnh.', [
            {
              text: 'OK', onPress: () => {
                setIsProcessing(false);
                setIsScanningActive(true);
              }
            },
          ]);
        } else {
          const scannedValue = results[0];
          Vibration.vibrate(100); // rung 100ms
          handleScannedValue(scannedValue);
        }
      } else {
        setIsScanningActive(true);
      }
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setIsScanningActive(true);
    }
  };

  // 2. Xử lý logic quét mã
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      // Lọc ra mã nằm trong khung quét
      const codeInFrame = codes.find(code => isCodeInFrame(code.frame));
      if (!isScanningActive || !codeInFrame) return;
      const scannedValue = codes[0]?.value;
      if (scannedValue) {
        Vibration.vibrate(100); // rung 100ms
        handleScannedValue(scannedValue);
      }
    },
  });
  const handleFrameLayout = (event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('FrameLayout', x, y, width, height);
  };

  // 3. Render giao diện
  const renderContent = () => {
    if (device == null) {
      return <CameraNotFoundView />;
    }

    if (!hasPermission) {
      return <PermissionView />;
    }

    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isScanningActive && isFocused}
        codeScanner={codeScanner}
        torch={isFlashOn ? 'on' : 'off'}
        enableZoomGesture
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      {isProcessing && <ProcessingOverlay />}
      <StatusBarCustom bgColor={Colors.static.black} />
      {/* Lớp phủ và Header */}
      <View style={styles.overlay}>
        {/* Header */}

        <HeaderNavigate title="Quét" style={styles.header} />

        {/* Phần thân */}

        <View onLayout={handleContentLayout} style={styles.bodyContainer}>
          <ScannerFrame
            frameSize={FRAME_SIZE}
            cornerSize={CORNER_SIZE}
            isScanningActive={isScanningActive}
            onLayout={handleFrameLayout}
          />

          <TouchableOpacity style={styles.flashButton} onPress={() => setIsFlashOn((prev) => !prev)}>
            <Zap size={20} color={Colors.static.white} fill={isFlashOn ? Colors.static.white : 'transparent'} />
            <Text style={styles.flashText}>Chạm để bật đèn</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Quét mã QR của bạn bè để kết nối</Text>
        </View>


        {/* Thanh công cụ dưới cùng */}
        <FlexBox direction="row" justify="space-around" align="center" style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.back()}>
            <QrCode size={28} color={Colors.static.white} />
            <Text style={styles.bottomButtonText}>Mã QR của tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleOpenLibrary}>
            <ImageIcon size={28} color={Colors.static.white} />
            <Text style={styles.bottomButtonText}>Thư viện</Text>
          </TouchableOpacity>
        </FlexBox>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    height: HEIGHT_HEADER,
    zIndex: 10,
    backgroundColor: Colors.static.black, // Nền mờ cho header
    width: '100%',

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.static.white,
  },
  iconButton: {
    padding: 8,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  flashButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  flashText: {
    color: Colors.static.white,
    fontSize: 14,
    marginTop: 8,
  },
  bottomBar: {
    width: '100%',
    height: BOTTOM_BAR_HEIGHT,
    paddingVertical: 20,
    backgroundColor: Colors.static.black,
    paddingBottom: 30, // Thêm padding cho các thiết bị có tai thỏ
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonText: {
    color: Colors.static.white,
    marginTop: 6,
    fontSize: 14,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});
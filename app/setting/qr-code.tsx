import FlexBox from '@/components/common/flex-box';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { showToast } from '@/services/toast';
import { useAuthStore } from '@/stores/auth';
import Clipboard from '@react-native-clipboard/clipboard';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, Link2, ScanLine, Share2 } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

const QR_CODE_BG_COLORS = ['#F9576E', '#FE2C55'];
export default function QRCodeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Giả sử user object có các thông tin này
  const profile = {
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=3',
    name: user?.name || 'Jiro',
    username: user?.username || '13tyu68ubjv',
    profileUrl: `https://tiktok.com/@${user?.username || '13tyu68ubjv'}`,
  };

  const handleCopyLink = async () => {
    Clipboard.setString(profile.profileUrl);
    showToast({
      message: 'Đã sao chép liên kết vào bộ nhớ tạm',
      type: 'success',
      icon: 'success',
    });
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Xem hồ sơ của ${profile.name} trên TikTok! | ${profile.profileUrl}`,
        url: profile.profileUrl, // Dành cho iOS
        title: `Hồ sơ TikTok của ${profile.name}`, // Dành cho Android
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
    }
  };

  return (
    <LinearGradient colors={QR_CODE_BG_COLORS} style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatusBarCustom />

        {/* Header */}
        <FlexBox direction="row" justify="space-between" align="center" style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft size={28} color={Colors.static.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/setting/qr-scanner')} style={styles.iconButton}>
            <ScanLine size={28} color={Colors.static.white} />
          </TouchableOpacity>
        </FlexBox>

        <View style={styles.content}>
          {/* Profile Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>@{profile.username}</Text>

            {/* QR Code */}
            <View style={styles.qrContainer}>
              <QRCode
                value={profile.profileUrl}
                size={180}
                color={Colors.static.black}
                backgroundColor={Colors.static.white}
                logo={{ uri: 'https://image-cdn.nct.vn/singer/avatar/2024/10/15/S/X/d/O/1728971611663_300.jpg' }}
                logoSize={180 * 0.2}
                logoMargin={10}
                logoBackgroundColor="transparent"
              />
              {/* Custom frame inside QR */}
              <View style={[styles.qrFrame, styles.qrFrameTopLeft]} />
              <View style={[styles.qrFrame, styles.qrFrameTopRight]} />
              <View style={[styles.qrFrame, styles.qrFrameBottomLeft]} />
              <View style={[styles.qrFrame, styles.qrFrameBottomRight]} />
            </View>

            <View>
              <Image source={require('@/assets/images/tiktok_logo.png')} style={styles.tiktokLogo} />
            </View>
          </View>

          {/* Action Buttons */}
          <FlexBox direction="row" gap={16} style={styles.buttonGroup}>
            <Button style={styles.actionButton} onPress={handleCopyLink}>
              <Link2 size={20} color={colors.text} style={styles.rotateIcon} />
              <Text style={styles.actionButtonText}>Sao chép Liên kết</Text>
            </Button>
            <Button style={styles.actionButton} onPress={handleShareLink}>
              <Share2 size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>Chia sẻ liên kết</Text>
            </Button>
          </FlexBox>
        </View>

        <Text style={styles.footerText}>Kết nối và tận hưởng niềm vui với bạn bè trên TikTok</Text>
      </View>
    </LinearGradient>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    rotateIcon: {
      transform: [{ rotate: '135deg' }],
    },
    iconButton: {
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      zIndex: 2,
      marginBottom: -48, // Kéo avatar lên trên card
      // Shadow for avatar
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 4,
      borderColor: Colors.static.white,
    },
    card: {
      backgroundColor: Colors.static.white,
      borderRadius: 24,
      alignItems: 'center',
      paddingTop: 48 + 24, // 48 (nửa avatar) + 24 (padding)
      paddingBottom: 24,
      paddingHorizontal: 24,
      width: '100%',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    username: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 24,
    },
    qrContainer: {
      position: 'relative',
      padding: 10, // Giảm padding để frame nằm sát hơn
      backgroundColor: Colors.static.white,
      marginBottom: 20,
      // Không cần border ở đây nữa
    },
    qrFrame: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderColor: Colors.static.black,
    },
    qrFrameTopLeft: {
      top: 0,
      left: 0,
      borderTopLeftRadius: 12,
      borderTopWidth: 8,
      borderLeftWidth: 8,
    },
    qrFrameTopRight: {
      top: 0,
      right: 0,
      borderTopRightRadius: 12,
      borderTopWidth: 8,
      borderRightWidth: 8,
    },
    qrFrameBottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomLeftRadius: 12,
      borderBottomWidth: 8,
      borderLeftWidth: 8,
    },
    qrFrameBottomRight: {
      bottom: 0,
      right: 0,
      borderBottomRightRadius: 12,
      borderBottomWidth: 8,
      borderRightWidth: 8,
    },
    tiktokLogo: {
      objectFit: 'contain',
      height: 20,
    },
    tiktokText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    buttonGroup: {
      marginTop: 32,
      width: '100%',
    },
    actionButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingVertical: 14,
      flexDirection: 'column',
      gap: 4,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginTop: 4,
    },
    footerText: {
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      paddingBottom: 20,
      fontSize: 14,
    },
  });
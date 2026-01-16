import FlexBox from '@/components/common/flex-box';
import MenuItem from '@/components/common/menu-item';
import HeaderNavigate from '@/components/layout/header';
import ContentPopupLogout from '@/components/setting/popup-logout';
import StatusBarCustom from '@/components/ui/status-bar';
import { useAlert } from '@/contexts/alert-context';
import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router'; // Nếu dùng Expo Router
import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Database,
  FileQuestion,
  Heart,
  HelpCircle,
  Image as ImageIcon,
  Languages,
  Lock,
  LogOut,
  MapIcon,
  Megaphone,
  Monitor,
  Moon,
  Music,
  Play,
  Repeat,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Tv,
  User,
  Users,
  Video, Wallet
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
interface SettingItem {
  id: string;
  label: string;
  icon: any;
  hasDot?: boolean;
  rightItem?: any;
}
// Định nghĩa cấu trúc menu
const SETTINGS_DATA: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Tài khoản',
    items: [
      { id: 'account', label: 'Tài khoản', icon: User },
      { id: 'privacy', label: 'Quyền riêng tư', icon: Lock },
      { id: 'biometric-security', label: 'Bảo mật', icon: ShieldCheck },
      { id: 'orders', label: 'Đơn hàng của bạn', icon: ShoppingBag },
      { id: 'balance', label: 'Số dư', icon: Wallet },
      { id: 'share-profile', label: 'Chia sẻ hồ sơ', icon: Share2 },
      { id: 'map', label: 'Bản đồ', icon: MapIcon },
    ],
  },
  {
    title: 'Nội dung & Hiển thị',
    items: [
      { id: 'notifications', label: 'Thông báo', icon: Bell },
      { id: 'favorites', label: 'Yêu thích', icon: Bookmark },
      { id: 'live', label: 'LIVE', icon: Tv },
      { id: 'music', label: 'Âm nhạc', icon: Music },
      { id: 'activity-center', label: 'Trung tâm hoạt động', icon: Clock },
      { id: 'content-preferences', label: 'Tùy chọn nội dung', icon: Monitor },
      { id: 'audience-controls', label: 'Kiểm soát khán giả', icon: Users },
      { id: 'ads', label: 'Quảng cáo', icon: Megaphone },
      { id: 'playback', label: 'Phát', icon: Play },
      { id: 'display', label: 'Hiển thị', icon: Moon },
      { id: 'language', label: 'Ngôn ngữ', icon: Languages },
      { id: 'wellbeing', label: 'Thời gian và sức khỏe', icon: Heart, hasDot: true },
    ],
  },
  {
    title: 'Bộ nhớ đệm & Dữ liệu di động',
    items: [
      { id: 'offline-videos', label: 'Video ngoại tuyến', icon: Video },
      { id: 'free-up-space', label: 'Giải phóng dung lượng', icon: Trash2 },
      { id: 'data-saver', label: 'Trình Tiết kiệm Dữ liệu', icon: Database },
      { id: 'wallpaper', label: 'Hình nền', icon: ImageIcon },
    ],
  },
  {
    title: 'Hỗ trợ & Giới thiệu',
    items: [
      { id: 'help-center', label: 'Trung tâm Trợ giúp', icon: HelpCircle },
      { id: 'privacy-center', label: 'Trung tâm quyền riêng tư', icon: ShieldCheck },
      { id: 'terms', label: 'Điều khoản và Chính sách', icon: FileQuestion },
    ],
  },
  {
    title: 'Đăng nhập',
    items: [
      {
        id: 'switch-account', label: 'Chuyển đổi tài khoản', icon: Repeat,
        rightItem: <Image source={{ uri: 'https://i.pravatar.cc/150?img=3' }} style={{ width: 24, height: 24, borderRadius: 12 }} />
      },
      { id: 'logout', label: 'Đăng xuất', icon: LogOut },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { colors } = useTheme();
  const styles = useMemo(() => getThemedStyles(colors), [colors]);

  const handleLogout = () => {
    showAlert({
      content: <ContentPopupLogout />,
    })
  };

  const handleItemPress = (id: string) => {
    if (id === 'logout') {
      handleLogout();
      return;
    }
    // Navigate to other screens
    router.push(`/setting/${id}` as any);
    console.log('Pressed:', id);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <StatusBarCustom />
      <HeaderNavigate title="Cài đặt và quyền riêng tư" />

      <ScrollView style={styles.content}>
        {SETTINGS_DATA.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item) => {
              const Icon = item.icon;
              const iconNode = <Icon size={22} color={colors.textSecondary} strokeWidth={1.5} />;
              const rightItemNode = (
                <FlexBox direction="row" align="center" gap={8}>
                  {item?.hasDot && <View style={styles.dot} />}
                  {item?.rightItem || <ChevronRight size={20} color={colors.border} />}
                </FlexBox>
              );
              return (
                <MenuItem
                  key={item.id}
                  icon={iconNode}
                  text={item.label}
                  rightItem={rightItemNode}
                  onPress={() => handleItemPress(item.id)}
                />
              );
            })}
          </View>
        ))}

        <Text style={styles.versionText}>v42.9.3(420903)</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getThemedStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
  content: { flex: 1 },
  section: { paddingTop: 16 },
  sectionTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '500'
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  versionText: { textAlign: 'center', color: colors.textSecondary, fontSize: 12, marginVertical: 20 }
});
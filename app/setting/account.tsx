import HeaderNavigate from '@/components/layout/header';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  title: string;
  description?: string;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, description, onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      <ChevronRight size={20} color={colors.border} />
    </TouchableOpacity>
  );
};

export default function AccountScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const menuItems = [
    { id: 'info', title: 'Thông tin tài khoản' },
    { id: 'password', title: 'Mật khẩu' },
    {
      id: 'passkey',
      title: 'Passkey',
      description: 'Tạo passkey để đăng nhập vào TikTok bằng tính năng khóa màn hình, dấu vân tay hoặc mã PIN. Passkey an toàn hơn mật khẩu.',
    },
    { id: 'business', title: 'Chuyển sang Tài khoản doanh nghiệp' },
    {
      id: 'download',
      title: 'Tải về dữ liệu cá nhân',
      description: 'Nhận bản sao dữ liệu của bạn từ tất cả ứng dụng TikTok mà bạn sử dụng.',
    },
    { id: 'deactivate', title: 'Hủy kích hoạt hoặc xóa tài khoản' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNavigate title="Tài khoản" />
      <ScrollView style={styles.content}>
        {menuItems.map((item) => (
          <SettingItem key={item.id} title={item.title} description={item.description} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      marginTop: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    rowTitle: {
      fontSize: 16,
      color: colors.text,
    },
    rowDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
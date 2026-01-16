import FlexBox from '@/components/common/flex-box'; // Import component FlexBox của bạn
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { router } from 'expo-router';
import { MonitorPlay, QrCode, Settings, Wallet } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Định nghĩa danh sách menu để dễ quản lý
const MENU_ITEMS = [
  { 
    id: 'studio', 
    label: 'TikTok Studio', 
    icon: MonitorPlay // Icon đại diện (hoặc dùng Briefcase/User)
  },
  { 
    id: 'balance', 
    label: 'Số dư', 
    icon: Wallet 
  },
  { 
    id: 'qr', 
    label: 'Mã QR của bạn', 
    router: '/setting/qr-code',
    icon: QrCode 
  },
  { 
    id: 'settings', 
    label: 'Cài đặt và quyền riêng tư', 
    router: '/setting',
    icon: Settings 
  },
];

export const ProfileMenuContent = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const {hideModal} = useModal();
  const handleItemPress = (item: any) => {
    hideModal();
    if(item.router){
      router.push(item.router);
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {MENU_ITEMS.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <View key={item.id}>
            <TouchableOpacity 
              style={styles.itemContainer}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <FlexBox direction="row" align="center" gap={12}>
                <Icon size={22} color={colors.text} strokeWidth={1.5} />
                <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
              </FlexBox>
            </TouchableOpacity>

            {/* Đường kẻ mờ ngăn cách (trừ item cuối cùng) */}
            {index < MENU_ITEMS.length - 1 && <View style={styles.separator} />}
          </View>
        );
      })}
    </View>
  );
};

type ColorsType = ReturnType<typeof useTheme>['colors'];

const getStyles = (colors: ColorsType) => StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderTopLeftRadius: 12, // Bo góc nếu modal của bạn chưa bo
    borderTopRightRadius: 12,
  },
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20, 
  },
  label: {
    fontSize: 16,
    fontWeight: '500', // Hơi đậm nhẹ
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.border, // Sử dụng màu border từ theme
    marginLeft: 54, // Thụt vào trong thẳng hàng với text (bỏ qua icon)
    marginRight: 16,
  }
});
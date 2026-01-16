// src/components/profile/ProfileHeader.tsx
import FlexBox from '@/components/common/flex-box'; // Nhớ import đúng đường dẫn FlexBox của bạn
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context'; // Sử dụng hook thật từ context
import { ChevronDown, Footprints, Menu, UserPlus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ProfileMenuContent } from './menu';

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
    const {showModal} = useModal();
    const optionMemu = () =>{
        showModal({
            content:<ProfileMenuContent />,
            animationType:'slide-bottom',
            styleModalContent:{
              justifyContent:'flex-end'
            }

        })
    }
    const { colors } = useTheme();
    // Sử dụng useMemo để tránh tạo lại styles mỗi lần render không cần thiết
    const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <FlexBox 
      direction="row" 
      justify="space-between" 
      align="center" 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* 1. TRÁI: Nút thêm bạn */}
      <TouchableOpacity style={styles.iconBtn}>
        <UserPlus size={24} color={colors.text} />
      </TouchableOpacity>

      {/* 2. GIỮA: Tên User + Mũi tên (Chuyển acc) */}
      <TouchableOpacity style={styles.centerBtn}>
        <FlexBox direction="row" align="center" gap={4}>
          <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
          <ChevronDown size={14} color={colors.text} />
        </FlexBox>
      </TouchableOpacity>

      {/* 3. PHẢI: Lịch sử xem hồ sơ + Menu */}
      <FlexBox direction="row" gap={16} align="center">
        <TouchableOpacity style={styles.iconBtn}>
           {/* Icon dấu chân (Lịch sử xem) - Xoay nhẹ cho giống TikTok */}
          <Footprints size={24} color={colors.text} style={{ transform: [{ rotate: '-90deg' }] }} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconBtn} onPress={optionMemu}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
      </FlexBox>
    </FlexBox>
  );
};

// Lấy kiểu của object `colors` từ hook `useTheme` để type-safe
type ColorsType = ReturnType<typeof useTheme>['colors'];

const getStyles = (colors: ColorsType) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    padding: 4, // Tăng vùng bấm
  },
  centerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  username: {
    fontSize: 17,
    fontWeight: '700', // Bold đậm
  }
});
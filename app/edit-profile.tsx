import HeaderNavigate from '@/components/layout/header';
import { AvatarEdit } from '@/components/profile/edit/avatar-edit';
import { EditInputModal } from '@/components/profile/edit/edit-input-modal';
import { ProfileField } from '@/components/profile/edit/profile-field';
import StatusBarCustom from '@/components/ui/status-bar';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { useMutationUpdateProfile } from '@/hooks/react-query/user/use-mutation-update-profile';
import { useQueryProfile } from '@/hooks/react-query/user/use-query-profile';
import { useAuthStore } from '@/stores/auth';
import { Menu } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const userId = useAuthStore((state) => state.userId);
  const { data: profile } = useQueryProfile(userId);
  const { mutate: updateProfile } = useMutationUpdateProfile();
  const { showModal } = useModal();

  // Hàm xử lý mở modal sửa text
  const handleEditField = (field: string, title: string, value: string, multiline = false, maxLength = 30) => {
    showModal({
        content: (
            <EditInputModal 
                title={title} 
                value={value} 
                multiline={multiline}
                maxLength={maxLength}
                onSubmit={(newValue) => {
                    updateProfile({ [field]: newValue, id: userId });
                }} 
            />
        ),
        animationType: 'slide-bottom',
        styleModalContent: { justifyContent: 'flex-end', margin: 0 } // Hiển thị dạng Bottom Sheet sát đáy
    });
  };

  // Hàm xử lý chọn ảnh
  const handleAvatarPress = async () => {
    const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
    });

    if (!result.didCancel && !result.errorCode && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        // Trong thực tế: Upload ảnh lên server lấy URL -> updateProfile({ avatar: url })
        // Ở đây giả lập update luôn URI local
        updateProfile({ avatar: result.assets[0].uri, id: userId });
    }
  };


    if (!profile) return null;
  return (
    <View style={styles.container}>
        <StatusBarCustom bgColor="transparent" />
      <HeaderNavigate title="Sửa hồ sơ" />
      
      <ScrollView style={styles.content}>
        {/* Avatar Section */}
        <AvatarEdit 
          uri={profile.avatar} 
          onPress={handleAvatarPress} 
        />

        {/* Section 1: Thông tin chính */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin về bạn</Text>
          <ProfileField 
            label="Tên" 
            value={profile.name} 
            onPress={() => handleEditField('name', 'Tên', profile.name, false, 30)} 
          />
          <ProfileField 
            label="Tên người dùng" 
            value={profile.username} 
            onPress={() => handleEditField('username', 'Tên người dùng', profile.username, false, 24)} 
          />
          <ProfileField 
            label="" 
            value={`tiktok.com/@${profile.username}`} 
            isCopy 
            onPress={() => console.log('Copy Link')} 
          />
        </View>

        {/* Section 2: Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <ProfileField 
            label="Tiểu sử" 
            value={profile.bio} 
            placeholder="Thêm tiểu sử"
            onPress={() => handleEditField('bio', 'Tiểu sử', profile.bio || '', true, 80)} 
          />
          <ProfileField 
            label="Liên kết" 
            placeholder="Thêm liên kết" 
            onPress={() => console.log('Add Link')} 
          />
        </View>

        {/* Section 3: Khác */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khác</Text>
          <ProfileField label="Chương trình gây quỹ" placeholder="Thêm chương trình gây quỹ" />
          <ProfileField label="AI Self" placeholder="Thêm AI Self" />
        </View>

        {/* Section 4: Thứ tự hiển thị */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thay đổi thứ tự hiển thị</Text>
          <ProfileField 
            label="Đơn hàng của bạn" 
            rightIcon={<Menu size={20} color={colors.textSecondary} />}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  section: {
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
});
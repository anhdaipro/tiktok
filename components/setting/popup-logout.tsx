import { Colors } from '@/constants/theme';
import { useAlert } from '@/contexts/alert-context';
import { useTheme } from '@/contexts/theme-context';
import { useAuthStore } from '@/stores/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../ui/button';
const ContentPopupLogout = () =>{
  const {hideAlert} = useAlert()
  const router = useRouter();
  const queryClient = useQueryClient();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);
  const username = user?.username || '';
  const {colors} = useTheme();
  const handleLogout = () => {
    signOut();
    queryClient.clear();
    hideAlert();
    router.replace('/login');
  };

  const handleCancel = () => {
    hideAlert();
  }
  const styles = createTheme(colors);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <View style={styles.spacer}/>
          <Text style={styles.modalTitle}>Đăng xuất khỏi {username}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={hideAlert}>
          <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.spacer}/>
        <Text style={styles.modalText}>
          Bạn có chắc chắn không? Tài khoản của bạn sẽ bị đăng xuất và xóa khỏi thiết bị này.
        </Text>
         
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={handleCancel}>
            <Text style={[styles.buttonText, {color: colors.text}]}>Hủy</Text> 
          </Button>
          <Button style={[styles.button, styles.confirmButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.confirmButtonText]}>Đăng xuất</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
const createTheme = (colors: typeof Colors.light) => StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    gap:20,
  },
  divider: {
    height:1,
    width:'100%',
    paddingHorizontal:16,
    backgroundColor: colors.border,
  },
  spacer: {
    width: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text, // Màu đen
    textAlign: 'center',
  },
  closeButton: {
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.textSecondary, // Màu xám đậm
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 24,
  },

  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    gap:16,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    alignItems: 'center',
  },
  confirmButton: {
    // Nút "Chấp nhận" có nền
    backgroundColor: Colors.primary,
    gap:4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  confirmButtonText: {
    color: Colors.static.white,
  },
});
  
export default ContentPopupLogout;
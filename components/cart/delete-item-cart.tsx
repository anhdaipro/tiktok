
import FlexBox from '@/components/common/flex-box';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/contexts/alert-context';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
interface DeleteItemCartProps {
    itemId: string
    executeDelete: (itemId: string) => void
}
export const DeleteItemCart: React.FC<DeleteItemCartProps>= ({
    itemId,
    executeDelete,
}) => {
    const { colors } = useTheme();
    const { showAlert, hideAlert } = useAlert();
    const router = useRouter();
    return (
        <View style={styles.alertContainer}>
        <View style={[styles.alertContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.alertTitle, { color: colors.text }]}>Xóa sản phẩm?</Text>
          <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </Text>
          
          <FlexBox direction="row" gap={12} style={{ marginTop: 24, width: '100%' }}>
            <Button 
              style={[styles.alertBtn, { backgroundColor: colors.border }]} 
              onPress={hideAlert}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>Hủy</Text>
            </Button>
            <Button 
              style={[styles.alertBtn, { backgroundColor: colors.primary }]} 
              onPress={() => { executeDelete(itemId); hideAlert(); }}
            >
              <Text style={{ color: '#FFF', fontWeight: '600' }}>Xóa</Text>
            </Button>
          </FlexBox>
        </View>
      </View>
    )
};
const styles = StyleSheet.create({
    // Alert Styles
  alertContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  alertContent: {
    width: '85%',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  alertBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
  }
});
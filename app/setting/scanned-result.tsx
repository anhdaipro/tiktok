import HeaderNavigate from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { showToast } from '@/services/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ScannedResultScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { scannedValue } = useLocalSearchParams<{ scannedValue: string }>();

  const handleCopy = () => {
    if (scannedValue) {
      Clipboard.setString(scannedValue);
      showToast({
        message: 'Đã sao chép',
        type: 'success',
        icon: 'success',
      });
    }
  };
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarCustom />
      <HeaderNavigate title="Quét" onPress={() => router.back()} />
      <View style={styles.content}>
        <View style={styles.resultContainer}>
          <Text style={styles.scannedTitle}>Đã quét</Text>
          <Text style={styles.scannedContent}>{scannedValue}</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Button style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>Sao chép</Text>
          </Button>
          <Text style={styles.footerText}>
            Nội dung này đến từ một bên thứ ba. Nếu bạn muốn xem nội dung này, vui lòng sao chép nội dung/liên kết ở trên và dán vào trình duyệt. Chúng tôi khuyên bạn nên thận trọng khi mở các liên kết bạn không nhận ra.
          </Text>
        </View>
      </View>
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
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
    },
    resultContainer: {
      marginTop: 20,
    },
    scannedTitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    scannedContent: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'left',
    },
    bottomContainer: {
      paddingBottom: 20,
    },
    copyButton: {
      backgroundColor: colors.text,
      paddingVertical: 14,
      borderRadius: 8,
    },
    copyButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
    footerText: {
      marginTop: 16,
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'left',
      lineHeight: 20,
    },
  });
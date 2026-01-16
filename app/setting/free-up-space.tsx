import FuncHelper from '@/common/helpers/func-help';
import FlexBox from '@/components/common/flex-box';
import HeaderNavigate from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { useStorageManager } from '@/hooks/use-storage';
import { showToast } from '@/services/toast';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, DimensionValue, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function FreeUpSpaceScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <StatusBarCustom bgColor={colors.background} />
      <HeaderNavigate title="Giải phóng dung lượng" />
      <StorageView />
    </View>
  );
}

const StorageView = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    stats,
    loading,
    refresh,
    clearCache,
    clearDownloads,
  } = useStorageManager();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refresh();
    }
  }, [isFocused, refresh]);

  const [isClearingCache, setClearingCache] = useState(false);
  const [isClearingDownloads, setClearingDownloads] = useState(false);

  const handleClearCache = async () => {
    setClearingCache(true);
    const success = await clearCache();
    if (success) {
      showToast({
        message: 'Đã xóa bộ nhớ đệm',
        type: 'success',
        icon: 'success',
        duration: 3000,
      });
    }
    setClearingCache(false);
  };

  const handleClearDownloads = async () => {
    setClearingDownloads(true);
    const success = await clearDownloads();
    if (success) {
      showToast({
        message: 'Đã xóa tải về',
        type: 'success',
        icon: 'success',
        duration: 3000,
      });
    }
    setClearingDownloads(false);
  };

  const {
    appCache = 0,
    appDownloads = 0,
    appTotal = 0,
    systemTotal = 0,
  } = stats || {};

  // appTotal = appCode + appData (includes downloads) + appCache
  // Use appTotal from stats as the main number

  const totalDeviceBytes = systemTotal;
  const usagePercentage = totalDeviceBytes > 0 ? (appTotal / totalDeviceBytes) * 100 : 0;

  // Calculate segments for progress bar
  const tiktokUsagePercentage = usagePercentage;
  const otherAppsUsagePercentage = stats?.systemOtherApps && totalDeviceBytes > 0
    ? (stats.systemOtherApps / totalDeviceBytes) * 100
    : 0;

  const progressBarStyles = useMemo(() => ({
    tiktok: { width: `${tiktokUsagePercentage}%` as DimensionValue, backgroundColor: colors.primary },
    otherApps: { width: `${otherAppsUsagePercentage}%` as DimensionValue, backgroundColor: colors.yellow },
  }), [tiktokUsagePercentage, otherAppsUsagePercentage, colors]);

  if (loading && !stats) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <ScrollView style={styles.content}>
      <View style={styles.storageInfo}>
        <Text style={styles.storageTitle}>Dữ liệu Tiktok</Text>
        <Text style={styles.storageAmount}>{FuncHelper.formatBytes(appTotal, 'GB')}</Text>
        <Text style={styles.storageDescription}>
          Chiếm ~{usagePercentage.toFixed(1)}% dung lượng lưu trữ của thiết bị
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, progressBarStyles.tiktok]} />
          <View style={[styles.progressBar, progressBarStyles.otherApps]} />
        </View>
        <FlexBox direction="row" justify='flex-start' gap={16} style={{ marginTop: 12, }}>
          <FlexBox direction="row" align="center" gap={6}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>TikTok</Text>
          </FlexBox>
          <FlexBox direction="row" align="center" gap={6}>
            <View style={[styles.legendDot, { backgroundColor: colors.yellow }]} />
            <Text style={styles.legendText}>Ứng dụng khác</Text>
          </FlexBox>
          <FlexBox direction="row" align="center" gap={6}>
            <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
            <Text style={styles.legendText}>Trống</Text>
          </FlexBox>
        </FlexBox>
      </View>

      <View style={styles.section}>
        <FlexBox direction="row" justify="space-between" align="center">
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Bộ nhớ đệm: {FuncHelper.formatBytes(appCache, 'MB')}</Text>
            <Text style={styles.sectionDescription}>
              Hãy xóa bộ nhớ đệm để giải phóng dung lượng. Điều này sẽ không ảnh hưởng đến trải nghiệm TikTok của bạn.
            </Text>
          </View>
          <Button style={styles.clearButton} onPress={handleClearCache} disabled={isClearingCache || appCache === 0}>
            {isClearingCache ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.clearButtonText}>Xóa</Text>
            )}
          </Button>
        </FlexBox>
      </View>

      <View style={styles.section}>
        <FlexBox direction="row" justify="space-between" align="center">
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Tải về: {FuncHelper.formatBytes(appDownloads, 'MB')}</Text>
            <Text style={styles.sectionDescription}>
              Mục Tải về có thể bao gồm các hiệu ứng, bộ lọc, nhãn dán, video ngoại tuyến và quà tặng ảo đã được tải về trong ứng dụng của bạn. Bạn sẽ có thể tải chúng về lại nếu cần.
            </Text>
          </View>
          <Button style={styles.clearButton} onPress={handleClearDownloads} disabled={isClearingDownloads || appDownloads === 0}>
            {isClearingDownloads ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.clearButtonText}>Xóa</Text>
            )}
          </Button>
        </FlexBox>
      </View>

      <Text style={styles.footerText}>
        Dữ liệu TikTok cũng bao gồm tệp tin hệ thống giúp ứng dụng chạy mượt mà và không thể xóa.
      </Text>
    </ScrollView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    storageTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    content: { paddingHorizontal: 16, paddingTop: 8 },
    storageInfo: { marginVertical: 16 },
    storageAmount: { fontSize: 28, fontWeight: 'bold', color: colors.text },
    storageDescription: { fontSize: 14, color: colors.textSecondary, },
    progressBarContainer: {
      flexDirection: 'row',
      height: 10,
      width: '100%',
      backgroundColor: colors.border,
      borderRadius: 5,
      marginTop: 20,
      overflow: 'hidden',
    },
    progressBar: { height: '100%' },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 12, color: colors.textSecondary },
    section: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
    sectionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      lineHeight: 20,
    },
    clearButton: {
      backgroundColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderRadius: 20,
      marginLeft: 16,
    },
    clearButtonText: {
      color: colors.text,
      fontWeight: '600',
    },
    footerText: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginVertical: 20,
      paddingHorizontal: 16,
      lineHeight: 18,
    },
    toastContainer: {
      position: 'absolute',
      bottom: 80,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
    },
    toastText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
  });
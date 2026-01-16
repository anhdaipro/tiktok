import FlexBox from '@/components/common/flex-box';
import HeaderNavigate from '@/components/layout/header';
import StatusBarCustom from '@/components/ui/status-bar';
import CustomSwitch from '@/components/ui/switch';
import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const lightThemeImage = require('@/assets/images/theme-light.png');
const darkThemeImage = require('@/assets/images/theme-dark.png');

export default function DisplayScreen() {
  const { colors, themeMode, handleThemeChange } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const theme = useColorScheme();
  const isSystemTheme = themeMode == 'system';

  const handleChangeTheme = (value: boolean) => {
    handleThemeChange(value ? 'system' : themeMode == 'dark' ? 'dark' : 'light');
  };

  const isDarrkTheme = themeMode == 'dark' || (themeMode === 'system' && theme === 'dark');
  const isLightTheme = themeMode == 'light' || (themeMode === 'system' && theme === 'light');
  return (
    <SafeAreaView style={styles.container}>
      <StatusBarCustom />
      <HeaderNavigate title="Hiển thị" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Hình thức</Text>
        <FlexBox direction="row" justify="space-around" style={styles.themeSelectionContainer}>
          {/* Light Theme */}
          <TouchableOpacity onPress={() => handleThemeChange('light')} activeOpacity={0.8}>
            <Image source={lightThemeImage} style={styles.themeImage} />
            <FlexBox direction="row" align="center" justify="center" gap={8} style={{ marginTop: 8 }}>
              <Text style={styles.themeLabel}>Sáng</Text>
              <View style={styles.radioOuter}>
                {isLightTheme && <View style={styles.radioInner} />}
              </View>
            </FlexBox>
          </TouchableOpacity>

          {/* Dark Theme */}
          <TouchableOpacity onPress={() => handleThemeChange('dark')} activeOpacity={0.8}>
            <Image source={darkThemeImage} style={styles.themeImage} />
            <FlexBox direction="row" align="center" justify="center" gap={8} style={{ marginTop: 8 }}>
              <Text style={styles.themeLabel}>Tối</Text>
              <View style={styles.radioOuter}>
                {isDarrkTheme && <View style={styles.radioInner} />}
              </View>
            </FlexBox>
          </TouchableOpacity>
        </FlexBox>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Sử dụng cài đặt của thiết bị</Text>
            <Text style={styles.rowDescription}>
              Thiết đặt giao diện phù hợp với cài đặt Hiển thị & Độ sáng trên thiết bị của bạn.
            </Text>
          </View>
          <CustomSwitch value={isSystemTheme} onValueChange={(value) => handleChangeTheme(value)} />
          {/* <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
            onValueChange={(value) => handleThemeChange(value ? 'system' : themeMode === 'dark' ? 'dark' : 'light')}
            value={themeMode === 'system'}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16 },
    sectionTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
      marginBottom: 16,
    },
    themeSelectionContainer: {
      paddingBottom: 24,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    themeImage: {
      width: 120,
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeLabel: { fontSize: 16, color: colors.text },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
    rowTitle: { fontSize: 16, color: colors.text, marginBottom: 4 },
    rowDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 18 },
  });
import HeaderNavigate from '@/components/layout/header';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

interface LanguageItemProps {
  title: string;
  description?: string;
  rightContent?: string | React.ReactNode;
  onPress?: () => void;
  isSwitch?: boolean;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ title, description, rightContent, onPress, isSwitch }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isEnabled, setIsEnabled] = useState(true);

  const RightComponent = () => {
    if (isSwitch) {
      return <Switch trackColor={{ false: colors.border, true: colors.primary }} thumbColor={"#fff"} onValueChange={setIsEnabled} value={isEnabled} />;
    }
    if (typeof rightContent === 'string') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.rightText}>{rightContent}</Text>
          <ChevronRight size={20} color={colors.border} />
        </View>
      );
    }
    return rightContent;
  };

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      <RightComponent />
    </TouchableOpacity>
  );
};

export default function LanguageScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNavigate title="Ngôn ngữ" />
      <ScrollView style={styles.content}>
        <LanguageItem title="Ngôn ngữ ứng dụng" description="Chọn ngôn ngữ ứng dụng mặc định của bạn" rightContent="Tiếng Việt" />

        <Text style={styles.sectionTitle}>Bản dịch</Text>
        <LanguageItem
          title="Luôn dịch bài đăng"
          description="Bài đăng sẽ được dịch sang ngôn ngữ bạn chọn khi có thể, bao gồm nội dung mô tả bài đăng, bình luận, tiêu đề ảnh, phụ đề video và văn bản trong video."
          isSwitch
        />
        <LanguageItem title="Dịch sang" description="Đối với các tính năng hỗ trợ dịch thuật, chúng tôi sẽ dịch văn bản sang ngôn ngữ này khi bạn bật tính năng dịch." rightContent="Tiếng Việt" />
        <LanguageItem title="Không dịch" description="Chọn ngôn ngữ bạn không muốn dịch tự động" rightContent="Tiếng Việt" />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingTop: 8 },
    sectionTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      paddingHorizontal: 16,
      marginVertical: 12,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },
    rowTitle: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    rowDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    rightText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });
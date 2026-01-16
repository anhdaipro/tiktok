import FlexBox from '@/components/common/flex-box';
import HeaderNavigate from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useUploadStore } from '@/stores/upload-store';
import { useRouter } from 'expo-router';
import { Book, Quote } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Mock Styles
const STYLES = [
  { id: '1', bg: '#FFF9C4', color: '#000', name: 'Vàng' },
  { id: '2', bg: '#E3F2FD', color: '#000', name: 'Xanh' },
  { id: '3', bg: '#000000', color: '#FFF', name: 'Đen' },
  { id: '4', bg: '#F3E5F5', color: '#000', name: 'Tím' },
  { id: '5', bg: '#E0F2F1', color: '#000', name: 'Ngọc' },
];

export default function TextToImagePreviewScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { textToImage, setUploadData } = useUploadStore();
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);

  const handleNext = () => {
    setUploadData({
      textStyle: {
        bg: selectedStyle.bg,
        color: selectedStyle.color,
      }
    });
    router.push('/upload/post');
  };

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      
      {/* Header Overlay */}
      <HeaderNavigate title="Xây dựng" />

      {/* Main Preview */}
      <View style={styles.previewContainer}>
        <View style={[styles.card, { backgroundColor: selectedStyle.bg }]}>
            <Quote size={48} color={Colors.secondary} style={styles.quoteIcon} fill={Colors.secondary} />
            <Text style={[styles.cardText, { color: selectedStyle.color }]}>{textToImage || 'ol'}</Text>
            <View style={styles.watermark}>
                <Text style={styles.watermarkText}>Daily memo ▲</Text>
            </View>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        <Text style={styles.styleTitle}>Chọn một phong cách</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.styleList}>
            {STYLES.map((item) => (
                <TouchableOpacity 
                    key={item.id} 
                    onPress={() => setSelectedStyle(item)}
                    style={[
                        styles.styleItem, 
                        selectedStyle.id === item.id && styles.styleItemActive
                    ]}
                >
                    <View style={[styles.stylePreview, { backgroundColor: item.bg }]}>
                        <Text style={[styles.stylePreviewText, { color: item.color }]}>ol</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>

        <FlexBox direction="row" justify="space-between" align="center" style={styles.footer}>
            <Button style={styles.diaryBtn} variant="outline">
                <Book size={16} color={colors.text} />
                <Text style={styles.diaryBtnText}>Nhật ký của bạn</Text>
            </Button>
            <Button style={styles.nextBtn} onPress={handleNext}>
                <Text style={styles.nextBtnText}>Tiếp</Text>
            </Button>
        </FlexBox>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  iconBtn: { padding: 8 },
  musicBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6
  },
  musicText: { fontSize: 13, fontWeight: '600', color: colors.text },
  
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
      width: width - 40,
      aspectRatio: 3/4,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      position: 'relative',
  },
  quoteIcon: { position: 'absolute', top: 32, right: 32 },
  cardText: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  watermark: { position: 'absolute', bottom: 32, left: 32 },
  watermarkText: { color: Colors.secondary, fontWeight: '600' },

  bottomContainer: { paddingBottom: 20 },
  styleTitle: { paddingHorizontal: 16, fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  styleList: { paddingHorizontal: 16, gap: 12, paddingBottom: 20 },
  styleItem: { padding: 2, borderRadius: 9, borderWidth: 2, borderColor: 'transparent' },
  styleItemActive: { borderColor: colors.primary },
  stylePreview: { width: 60, height: 80, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: colors.border },
  stylePreviewText: { fontSize: 12, fontWeight: 'bold' },

  footer: { paddingHorizontal: 16, marginTop: 10 },
  diaryBtn: { backgroundColor: colors.surface, borderRadius: 24, paddingHorizontal: 16, gap: 8, borderWidth: 0 },
  diaryBtnText: { color: colors.text, fontWeight: '600' },
  nextBtn: { backgroundColor: colors.primary, borderRadius: 2, paddingHorizontal: 32, paddingVertical: 12 },
  nextBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

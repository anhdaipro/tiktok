import HeaderNavigate from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { useUploadStore } from '@/stores/upload-store';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default function TextToImageInputScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const [text, setText] = useState('');
  const setUploadData = useUploadStore((state) => state.setUploadData);

  const handleNext = () => {
    if (text.trim()) {
      setUploadData({
        type: 'text',
        textToImage: text,
      });
      router.push('/upload/preview-tex');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      <HeaderNavigate title="TẠO HÌNH ẢNH TỪ VĂN BẢN CỦA BẠN" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Chia sẻ suy nghĩ hoặc câu hỏi của bạn để khơi mào cuộc thảo luận"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
              textAlignVertical="center"
            />
          </View>

          <View style={styles.footer}>
            <Button
              style={[styles.nextButton, !text.trim() && styles.disabledButton]}
              onPress={handleNext}
              disabled={!text.trim()}
            >
              <Text style={styles.nextButtonText}>Tiếp</Text>
            </Button>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, padding: 20, justifyContent: 'space-between' },
    inputContainer: { flex: 1, justifyContent: 'center' },
    input: {
      fontSize: 24,
      color: colors.text,
      textAlign: 'center',
      fontWeight: '600',
    },
    footer: { paddingBottom: 20 },
    nextButton: { backgroundColor: colors.primary, borderRadius: 2, paddingVertical: 12 },
    disabledButton: { backgroundColor: colors.border, opacity: 0.5 },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  });

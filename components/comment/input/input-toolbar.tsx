import { useTheme } from '@/contexts/theme-context';
import { AtSign, Gift, Image as ImageIcon, Send, Smile } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

interface InputToolbarProps {
  onPickImages: () => void;
  onAtPress: () => void;
  onSend: () => void;
  isPending: boolean;
  isUploading: boolean;
  hasText: boolean;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  onPickImages,
  onAtPress,
  onSend,
  isPending,
  isUploading,
  hasText,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.toolbar}>
      <View style={styles.leftTools}>
        <TouchableOpacity style={styles.toolIcon} onPress={onPickImages}>
          <ImageIcon size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolIcon}>
          <Smile size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolIcon} onPress={onAtPress}>
          <AtSign size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolIcon}>
          <Gift size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.sendButton, !hasText && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!hasText || isPending}
      >
        {isPending || isUploading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Send size={20} color="#fff" fill="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
    },
    leftTools: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    toolIcon: {
      padding: 4,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#fe2c55',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

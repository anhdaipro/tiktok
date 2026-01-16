import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EMOJIS = ['😂', '🥰', '😭', '😡', '👍', '😅', '🥺', '😮'];

interface EmojiPickerProps {
  onEmojiPress: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.emojiContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always">
        {EMOJIS.map((emoji, index) => (
          <TouchableOpacity key={index} style={styles.emojiItem} onPress={() => onEmojiPress(emoji)}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    emojiContainer: {
      marginBottom: 10,
      height: 40,
    },
    emojiItem: {
      marginRight: 15,
      justifyContent: 'center',
    },
    emojiText: {
      fontSize: 28,
      color: colors.text,
    },
  });

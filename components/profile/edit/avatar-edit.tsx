import { useTheme } from '@/contexts/theme-context';
import { Image } from "expo-image";
import { Camera } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface AvatarEditProps {
  uri: string;
  onPress?: () => void;
}

export const AvatarEdit = ({ uri, onPress }: AvatarEditProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.avatarContainer}>
        <Image source={{ uri }} style={styles.avatar} />
        <View style={styles.overlay}>
          <Camera size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <Text style={styles.changeText}>Thay đổi ảnh</Text>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.8, // Làm mờ nhẹ ảnh gốc để icon camera nổi bật hơn
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
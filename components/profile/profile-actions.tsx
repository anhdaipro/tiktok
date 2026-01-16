import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { ChevronDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ProfileActionsProps {
  isCurrentUser: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onShareProfile?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
}

export const ProfileActions = ({ 
    isCurrentUser, 
    isFollowing, 
    onEditProfile, 
    onShareProfile,
    onFollow,
    onMessage
}: ProfileActionsProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  if (isCurrentUser) {
    return null;
  }

  return (
    <FlexBox direction="row" justify="center" gap={8} style={styles.buttonsContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.primaryButton]} 
        onPress={onFollow}
      >
        <Text style={styles.primaryButtonText}>{isFollowing ? 'Đang Follow' : 'Follow'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
        <Text style={styles.actionButtonText}>Nhắn tin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.iconButton]}>
         <ChevronDown size={20} color={colors.text} />
      </TouchableOpacity>
    </FlexBox>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
    buttonsContainer: { marginBottom: 12, width: '100%' },
    actionButton: { paddingVertical: 10, paddingHorizontal: 24, backgroundColor: colors.surface, borderRadius: 4, minWidth: 100, alignItems: 'center', justifyContent: 'center' },
    actionButtonText: { fontWeight: '600', color: colors.text },
    primaryButton: { backgroundColor: '#FE2C55' }, 
    primaryButtonText: { color: 'white', fontWeight: '600' },
    iconButton: { minWidth: 40, paddingHorizontal: 10 },
});
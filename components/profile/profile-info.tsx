import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { Pencil, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileInfoProps {
  avatar: string;
  name: string;
  username: string;
  stats: {
    following: number;
    followers: number;
    likes: number;
  };
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
}

const StatBox = ({ num, label }: { num: number; label: string }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createThemedStyles(colors), [colors]);
    return(
    <FlexBox align="center" gap={2} style={styles.statBox}>
        <Text style={styles.statNumber}>{num}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </FlexBox>
)};

export const ProfileInfo = ({ avatar, name, username, stats, isCurrentUser, onEditProfile }: ProfileInfoProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <FlexBox align="center" gap={12} style={styles.infoSection}>
        <View style={{ position: 'relative' }}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {isCurrentUser && (
                 <View style={styles.plusIcon}>
                    <Plus size={14} color={colors.white} strokeWidth={4} />
                </View>
            )}
        </View>
        <View style={{alignItems:'center', gap: 4}}>
            <FlexBox direction="row" align="center" gap={8}>
                <Text style={styles.profileName}>{name}</Text>
                {isCurrentUser && (
                    <TouchableOpacity onPress={onEditProfile} style={styles.editIcon}>
                        <Pencil size={12} color={colors.text} />
                    </TouchableOpacity>
                )}
            </FlexBox>
            <Text style={styles.profileUsername}>@{username}</Text>
        </View>
      </FlexBox>

      {/* Stats */}
      <FlexBox direction="row" justify="center" align="center" style={styles.statsContainer}>
        <StatBox num={stats.following} label="Đã follow" />
        <View style={styles.separator} />
        <StatBox num={stats.followers} label="Follower" />
        <View style={styles.separator} />
        <StatBox num={stats.likes} label="Thích" />
      </FlexBox>
    </View>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    infoSection: { paddingVertical: 12 },
    avatar: { width: 96, height: 96, borderRadius: 48 },
    plusIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.secondary, borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.background },
    profileName: { fontWeight: 'bold', fontSize: 18, color: colors.text },
    editIcon: { padding: 4, backgroundColor: colors.surface, borderRadius: 4 },
    profileUsername: { color: colors.textSecondary, fontSize: 14 },
    statsContainer: { marginVertical: 12 },
    statBox: { paddingHorizontal: 20, alignItems: 'center' },
    statNumber: { fontWeight: 'bold', fontSize: 17, color: colors.text },
    statLabel: { color: colors.textSecondary, fontSize: 13 },
    separator: { width: 1, height: 14, backgroundColor: colors.border },
});
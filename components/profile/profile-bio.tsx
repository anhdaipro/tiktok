import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileBioProps {
  bio?: string;
  children?: ReactNode;
}

export const ProfileBio = ({ bio, children }: ProfileBioProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {bio && <Text style={styles.bioText}>{bio}</Text>}
      {children && (
        <FlexBox direction="row" wrap="wrap" justify="center" gap={16} style={styles.featuresContainer}>
            {children}
        </FlexBox>
      )}
    </View>
  );
};

export const ProfileFeatureItem = ({ icon, text }: { icon: ReactNode, text: string }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createThemedStyles(colors), [colors]);
    return (
        <FlexBox direction="row" align="center" gap={4}>
            {icon}
            <Text style={styles.featureText}>{text}</Text>
        </FlexBox>
    )
}

const createThemedStyles = (colors: any) => StyleSheet.create({
    container: { alignItems: 'center', marginBottom: 12, paddingHorizontal: 32, width: '100%' },
    bioText: { textAlign: 'center', color: colors.text, marginBottom: 8 },
    featuresContainer: { marginTop: 4 },
    featureText: { fontWeight: '600', color: colors.text, fontSize: 13 },
});
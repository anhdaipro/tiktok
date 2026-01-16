import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedBar from '../common/animation-bar';
import FlexBox from '../common/flex-box';

interface FollowingChannelItemProps {
    avatar: string;
    shopName: string;
    isLive: boolean;
    onPress?: () => void;
}

export const FollowingChannelItem = ({
    avatar,
    shopName,
    isLive,
    onPress,
}: FollowingChannelItemProps) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                {isLive && (
                    <View style={styles.liveBadge}>
                        <FlexBox style={{ bottom: 5, position: 'absolute' }} direction="row" gap={2} align='flex-end' justify='center'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <AnimatedBar key={i} maxHeight={16} minHeight={4} />
                            ))}
                        </FlexBox>

                    </View>
                )}
            </View>
            <Text style={[styles.shopName, { color: colors.text }]} numberOfLines={1}>
                {shopName}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        width: 80,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#FF2D55',
    },
    liveBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF2D55',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    shopName: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
});

import ErrorComponent from '@/components/common/error';
import Separator from '@/components/common/separator';
import { TabConfig, Tabs } from '@/components/common/tabs';
import { ProfileHeader } from '@/components/profile/header';
import { ProfileActions } from '@/components/profile/profile-actions';
import { ProfileBio, ProfileFeatureItem } from '@/components/profile/profile-bio';
import { ProfileInfo } from '@/components/profile/profile-info';
import TabViewVideo from '@/components/profile/tab-view-video';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { useQueryProfile } from '@/hooks/react-query/user/use-query-profile';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'expo-router';
import { Heart, Lock, Play, Repeat, Save, ShoppingCart } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';

type TabName = 'videos' | 'private' | 'repose' | 'shared' | 'liked';

const { width } = Dimensions.get('window');
const WIDTH_TAB = width * 0.8

const TABS_CONFIG: TabConfig<TabName>[] = [
    { id: 'videos', icon: Play },
    { id: 'private', icon: Lock },
    { id: 'repose', icon: Repeat },
    { id: 'shared', icon: Save },
    { id: 'liked', icon: Heart },
];
const ProfileHeaderContent = React.memo(({
    profile,
    isCurrentUser = true, // Mặc định là true cho tab profile cá nhân
    onEditProfile
}: {
    profile: any;
    isCurrentUser?: boolean;
    onEditProfile?: () => void;
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createThemedStyles(colors), [colors]);

    if (!profile) return null;

    return (
        <View style={styles.headerContentContainer}>
            <ProfileInfo
                avatar={profile.avatar}
                name={profile.name}
                username={profile.username}
                stats={{

                    following: profile.following_count,
                    followers: profile.follower_count,
                    likes: profile.heart_count
                }}
                isCurrentUser={isCurrentUser}
                onEditProfile={onEditProfile}
            />

            <ProfileActions
                isCurrentUser={isCurrentUser}
                isFollowing={profile.is_following}
                onEditProfile={onEditProfile}
            />

            <ProfileBio bio={profile.bio || "fffffffffff"}>
                {/* Ví dụ tính năng "Đơn hàng của bạn" cho user hiện tại */}
                {isCurrentUser && (
                    <ProfileFeatureItem
                        icon={<ShoppingCart size={16} color={colors.primary} />}
                        text="Đơn hàng của bạn"
                    />
                )}
            </ProfileBio>

            {/* Tabs Icon */}

        </View>
    );
});
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);
const ProfileScreen = () => {
    const [activeTab, setActiveTab] = React.useState<TabName>('videos');
    const scrollX = useSharedValue(0);
    const userId = useAuthStore((state) => state.userId);
    const router = useRouter();
    const { colors } = useTheme();
    const styles = useMemo(() => createThemedStyles(colors), [colors]);
    const { data: profile, isLoading, isError, error, refetch } = useQueryProfile(userId);
    const handleEditProfile = useCallback(() => {
        router.push('/edit-profile');
    }, [router]);
    const pagerRef = React.useRef<PagerView>(null);
    const handleTabChange = useCallback((tab: TabName) => {
        setActiveTab(tab);
        const index = TABS_CONFIG.findIndex((t) => t.id === tab);
        if (index !== -1) {
            pagerRef.current?.setPage(index);
        }
    }, []);

    const onPageSelected = useCallback((e: any) => {
        const index = e.nativeEvent.position;
        const tab = TABS_CONFIG[index]?.id;
        if (tab) {
            setActiveTab(tab);
        }
    }, []);
    const onPageScroll = useEvent<PagerViewOnPageScrollEvent>(
        (event) => {
            'worklet';
            const { position, offset } = event;
            scrollX.value = position + offset;
        },
        ['onPageScroll']
    );


    // Nếu không có userId (chưa đăng nhập), hiển thị màn hình mời đăng nhập
    if (!userId) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.loginTitle}>Đăng nhập để xem hồ sơ</Text>
                <Text style={styles.loginSubtitle}>
                    Khi đăng nhập, bạn có thể xem chi tiết hồ sơ, video đã đăng và nhiều hơn nữa.
                </Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Nếu đang tải dữ liệu profile, hiển thị loading
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.text} />
            </SafeAreaView>
        );
    }
    if (isError) {
        return (
            <View style={styles.emptyComponentContainer}>
                <ErrorComponent
                    onRetry={refetch}
                    errorText={'Không thể tải dữ liệu profile. Vui lòng thử lại.'}
                />
            </View>

        )
    }



    // Nếu không có dữ liệu profile (lỗi hoặc user không tồn tại)
    if (!profile) return null; // Hoặc hiển thị một màn hình lỗi

    return (
        <View style={styles.container}>
            {/* Header Actions */}
            <StatusBarCustom bgColor="transparent" />
            <ProfileHeader username={profile.username} />

            <ProfileHeaderContent
                profile={profile}
                onEditProfile={handleEditProfile}
            />
            <View style={{ alignItems: 'center' }}>
                <Tabs<TabName> scrollX={scrollX} onTabChange={handleTabChange} tabs={TABS_CONFIG} width={WIDTH_TAB} />
            </View>
            <Separator height={1} color='#ccc' style={{ width: `100%` }} />

            <AnimatedPagerView
                ref={pagerRef}
                style={styles.pagerView}
                initialPage={0}
                onPageSelected={onPageSelected}
                onPageScroll={onPageScroll}
            >
                {TABS_CONFIG.map(tab => {
                    return (
                        <TabViewVideo
                            key={tab.id}
                            activeTab={tab.id}
                            userId={userId}
                            isActive={activeTab === tab.id}
                        />
                    )
                })}
            </AnimatedPagerView>
        </View>
    );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
    emptyComponentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background

    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: colors.text,
        textAlign: 'center',
    },
    loginSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    loginButtonText: {
        color: colors.primaryForeground,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Styles for ProfileHeaderContent
    headerContentContainer: {
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    pagerView: {
        flex: 1,
    }
});

export default ProfileScreen;
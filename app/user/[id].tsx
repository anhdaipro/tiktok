import FlexBox from '@/components/common/flex-box';
import Separator from '@/components/common/separator';
import { TabConfig } from '@/components/common/tabs';
import HeaderNavigate from '@/components/layout/header';
import { ProfileActions } from '@/components/profile/profile-actions';
import { ProfileBio, ProfileFeatureItem } from '@/components/profile/profile-bio';
import { ProfileInfo } from '@/components/profile/profile-info';
import VideoItem from '@/components/profile/video-item';
import { useTheme } from '@/contexts/theme-context';
import { useQueryProfile } from '@/hooks/react-query/user/use-query-profile';
import useInfiniteVideos from '@/hooks/react-query/video/use-infinite-videos';
import { useVideoFeedStore } from '@/stores/video-feed-store';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bell, Heart, Play, Share2, ShoppingBag, Star } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const WIDTH_TAB = width;

const TABS_CONFIG: TabConfig<string>[] = [
  { id: 'videos', icon: Play },
  { id: 'liked', icon: Heart },
];

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [activeTab, setActiveTab] = useState<string>('videos');
  const setVideoFeed = useVideoFeedStore((state) => state.setFeed);

  // Fetch user profile
  const { data: profile, isLoading, isError, refetch } = useQueryProfile(id);

  // Fetch videos
  const params = useMemo(() => ({ userId: id }), [id]);
  const {
    videos,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch: refetchVideos,
  } = useInfiniteVideos({
    params,
    queryKey: ['public-profile-videos', id],
    enabled: !!id,
  });

  const handleVideoPress = (index: number) => {
    setVideoFeed(['public-profile-videos', id], params, index);
    router.push('/video-feed');
  };

  const HeaderRight = () => (
    <FlexBox direction="row" gap={16} align="center">
      <TouchableOpacity>
        <Bell size={24} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Share2 size={24} color={colors.text} />
      </TouchableOpacity>
    </FlexBox>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <HeaderNavigate title="Hồ sơ" />
        <Text style={{ color: colors.text, marginTop: 20 }}>Không tìm thấy người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderNavigate
        title={profile.name}
        itemRight={<HeaderRight />}
        style={{ borderBottomWidth: 0 }}
      />

      <FlashList
        data={videos}
        numColumns={3}
        estimatedItemSize={150}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <VideoItem item={item} onPress={() => handleVideoPress(index)} />
        )}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <ProfileInfo
              avatar={profile.avatar}
              name={profile.name}
              username={profile.username}
              stats={{
                following: profile.following_count,
                followers: profile.follower_count,
                likes: profile.heart_count,
              }}
              isCurrentUser={false}
            />

            <ProfileActions
              isCurrentUser={false}
              isFollowing={profile.is_following}
              onFollow={() => console.log('Follow')}
              onMessage={() => console.log('Message')}
            />

            <ProfileBio bio={profile.bio || "Chưa có tiểu sử"}>
              <ProfileFeatureItem
                icon={<ShoppingBag size={16} color={colors.primary} />}
                text="Phần trưng bày"
              />
              <ProfileFeatureItem
                icon={<Star size={16} color={colors.primary} />}
                text="Gói đăng ký"
              />
            </ProfileBio>

            {/* <Tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}

              tabs={TABS_CONFIG}
              width={WIDTH_TAB}
            /> */}
            <Separator height={1} color={colors.border} style={{ width: '100%' }} />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetchVideos} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingBottom: 0,
  },
});

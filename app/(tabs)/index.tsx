

import AdvancedFPSDisplay from '@/components/advanced-fps-display';
import ScrollTabs, { TabConfig } from '@/components/common/scroll-tabs';
import TabViewPage from '@/components/common/view-page-tab';
import Header from '@/components/home/header';
import { Colors } from '@/constants/theme';
import StorageManager from '@/native-modules/storage';
import { useRouter } from 'expo-router';
import { setVideoCacheSizeAsync } from 'expo-video';
import { LucideVegan, Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import Animated, { useEvent, useSharedValue } from 'react-native-reanimated';
const { height } = Dimensions.get('screen');

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const tabs: TabConfig<number>[] =
  [
    { id: 1, label: 'Hồ Chí Minh' },
    { id: 2, label: 'Khám phá', },
    { id: 3, label: 'Bạn bè' },
    { id: 4, label: 'Đã follow' },
    { id: 5, label: 'Đề xuất' },

  ]
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState(1);
  const scrollX = useSharedValue(0);
  // Set custom cache size toàn cục (tùy chọn, gọi 1 lần khi app start)
  useEffect(() => {
    const setVideoCacheSize = async () => {
      try {
        // Gọi hàm Native (Đây là hàm bất đồng bộ)
        const {
          systemFree
        } = await StorageManager.getStorageStats();
        const freeCache = systemFree;
        const cacheSize = 500 * 1024 * 1024;// 500MB
        setVideoCacheSizeAsync(Math.min(freeCache, cacheSize));
      } catch (error) {
        console.error(error);
      }
    };
    setVideoCacheSize();
  }, []);

  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const onPageSelected = useCallback((e: any) => {
    const index = e.nativeEvent.position;
    const tab = tabs[index]?.id;
    console.log(tab)
    if (tab) {
      setActiveTab(tab);
    }
  }, []);
  const handleTabChange = useCallback((activeTab: number) => {
    setActiveTab(activeTab);
    const index = tabs.findIndex((t) => t.id === activeTab);
    if (index !== -1) {
      pagerRef.current?.setPage(index);
    }
  }, []);

  const onPageScroll = useEvent<PagerViewOnPageScrollEvent>(
    (event) => {
      'worklet';
      const { position, offset } = event;
      scrollX.value = position + offset
    },
    ['onPageScroll']
  );


  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" />
      <Header>
        <LucideVegan color={Colors.static.white} size={24} />
        <ScrollTabs
          onTabChange={handleTabChange}
          tabs={tabs}
          scrollX={scrollX}

        />
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Search color={Colors.static.white} size={24} />
        </TouchableOpacity>

      </Header>
      <AdvancedFPSDisplay />
      <AnimatedPagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={onPageSelected}
        onPageScroll={onPageScroll}
      >
        {tabs.map((tab, index) => (
          <TabViewPage
            key={index}
            activeTab={tab.id}
            isActive={tab.id === activeTab}
          />
        ))}
      </AnimatedPagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.static.black,
  },

  pagerView: {
    flex: 1,
  },

  // === TOP TABS ===
  topTabsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },

});
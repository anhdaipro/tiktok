import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LiveStreamCard } from './live-stream-card';

export interface LiveStreamData {
    id: string;
    thumbnail: string;
    viewerCount: number;
    shopAvatar: string;
    shopName: string;
    productImage: string;
    productName: string;
    productPrice: number;
}

interface LiveStreamGridProps {
    streams: LiveStreamData[];
}

export const LiveStreamGrid = ({ streams }: LiveStreamGridProps) => {
    const router = useRouter();
    const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

    const onStreamPress = (id: string) => {
        router.push({
            pathname: '/live-stream/room',
            params: { roomId: id },
        });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ item: LiveStreamData }> }) => {
        const ids = new Set<string>(viewableItems.map((item) => item.item.id));
        setVisibleIds(ids);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = useCallback(({ item }: { item: LiveStreamData }) => (
        <LiveStreamCard
            {...item}
            onPress={() => onStreamPress(item.id)}
            isActive={visibleIds.has(item.id)}
        />
    ), [visibleIds]);

    return (
        <FlashList
            data={streams}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            estimatedItemSize={300}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 16,
    },
});

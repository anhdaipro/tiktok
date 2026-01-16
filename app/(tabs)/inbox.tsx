import Header from '@/components/inbox/header';
import { InboxRow } from '@/components/inbox/inbox-item';
import { KEY_NOTIFICATION } from '@/constants/key-query';
import useInfiniteNotifications from '@/hooks/react-query/notification.ts/use-infinite-notification';
import { useAuthStore } from '@/stores/auth';
import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const InboxScreen = () => {
    const userId = useAuthStore((state) => state.userId)
    const params = useMemo(() => ({ userId }), [userId]);
    const {isRefetching, 
        notifications,
        isFetchingNextPage, 
        fetchNextPage, 
        hasNextPage, 
        refetch} = useInfiniteNotifications({
        params,
        queryKey: [KEY_NOTIFICATION, userId],
        enabled: !!userId,
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <FlashList
                data={notifications}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                }
                renderItem={({ item }) => <InboxRow item={item} />}
                estimatedItemSize={70}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    }
})
export default InboxScreen;
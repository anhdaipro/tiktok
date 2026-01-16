import { NotificationApi } from "@/services/api/notification";
import { CommonFilters } from "@/types/api";
import { Cursor } from "@/types/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
interface Props {
  params: CommonFilters;
  queryKey: string[];
  staleTime?: number;
  enabled?: boolean
}

const useInfiniteNotifications = (props: Props) => {     
    const { params, queryKey, staleTime = 1000*60, enabled = true } = props;  
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch ,
        isRefetching,
    } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }: { pageParam?: Cursor }) =>
            NotificationApi.fetchNotifications({
            ...params,
            cursor: pageParam, // gửi nguyên cursor lên backend
            }),

        // ⭐ backend trả nextCursor
        getNextPageParam: (lastPage: any) =>
            lastPage.nextCursor ?? undefined,
        initialPageParam: null,
        staleTime,
        enabled,
    });
    const notifications = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
    return {
        notifications,
        fetchNextPage,
        hasNextPage,
        refetch,
        isRefetching,
        isFetchingNextPage,
    };
};

export default useInfiniteNotifications;
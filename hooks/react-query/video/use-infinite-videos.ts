import VideoApi from "@/services/api/videos";
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

const useInfiniteVideos = (props: Props) => {
    const { params, queryKey, staleTime = 1000 * 60 * 5, enabled = true } = props;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }: { pageParam?: Cursor }) =>
            VideoApi.fetchVideos({
                ...params,
                cursor: pageParam, // gửi nguyên cursor lên backend
            }),

        // ⭐ backend trả nextCursor
        getNextPageParam: (lastPage: any) =>
            lastPage.nextCursor ?? undefined,
        initialPageParam: null,
        staleTime,
        retry: 1,
        enabled,
    });
    const videos = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
    return {
        videos,
        fetchNextPage,
        hasNextPage,
        refetch,
        isRefetching,
        isFetchingNextPage,
    };
};

export default useInfiniteVideos;
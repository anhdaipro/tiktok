
import CommentApi from "@/services/api/comments";
import { Cursor } from "@/types/common";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useInfiniteComments = (queryKey: any, params:any, enabled: boolean = true) => {
  const { relateId } = params;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }: { pageParam?: Cursor }) =>
        CommentApi.fetchComments({
        ...params,
        cursor: pageParam, // gửi nguyên cursor lên backend
        }),

        // ⭐ backend trả nextCursor
    getNextPageParam: (lastPage: any) =>
        lastPage.nextCursor ?? undefined,
    initialPageParam: null,
    enabled: !!relateId && enabled, // Chỉ fetch khi có relateId và được cho phép
  });

  const comments = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  return { comments, 
    refetch,
    fetchNextPage, hasNextPage, isRefetching, isFetchingNextPage, isLoading, queryKey

  };
};

export default useInfiniteComments;
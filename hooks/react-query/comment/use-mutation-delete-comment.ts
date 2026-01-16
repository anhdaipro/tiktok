import CommentApi from "@/services/api/comments";
import { Comment } from "@/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutationDeleteComment = (queryKey: any[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => CommentApi.deleteComment(commentId),
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<{ pages: { data: Comment[] }[] }>(queryKey);

      // Optimistic remove
      queryClient.setQueryData<{ pages: { data: Comment[] }[] }>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(comment => comment._id !== commentId),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback nếu có lỗi
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch để đảm bảo đồng bộ
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
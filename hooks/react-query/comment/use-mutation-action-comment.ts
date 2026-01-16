import { KEY_VIDEO } from "@/constants/key-query";
import CommentApi from "@/services/api/comments";
import { Comment } from "@/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export type ActionType = 'like' | 'dislike';

interface ActionVideoPayload {
  commentId: string;
  action: ActionType;
}

interface ActionContext {
  previousComment?: Comment;
}

export const useMutationActionComment = (queryKey: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ActionVideoPayload, ActionContext>({
    mutationFn: ({ commentId, action }: ActionVideoPayload) => CommentApi.actionComment(commentId, action),

    // --- OPTIMISTIC UPDATE ---
    onSuccess: async (data,variables) => {
      const { commentId, action } = variables;
      queryClient.setQueryData<{ pages: { data: Comment[] }[] }>(queryKey, (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  return {
                    ...page,
                    data: page.data.map((comment) => {
                      if ((comment._id == commentId)) {
                        return {
                          ...comment,
                          ...data,
                        };
                      }
                      return comment;
                    }),
                  }
                }),
              };
            });
    },

    onError: (err, variables, context) => {
      if (context?.previousComment) {
        queryClient.setQueryData([KEY_VIDEO, variables.commentId], context.previousComment);
      }
    },
  });
};
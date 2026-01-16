import CommentApi from "@/services/api/comments";
import { Comment, TextComment } from "@/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateCommentPayload {
  text: TextComment[];
  relateId: string;
  mentions?: string[];
  objectType: number;
  [key: string]: any;
}

export const useMutationCreateComment = (queryKey: any[], callbackSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => CommentApi.createComment(payload),
    onSuccess: (newComment) => {
      callbackSuccess?.();
      console.log(newComment)
      // Cập nhật cache sau khi có phản hồi thành công từ server
      queryClient.setQueryData<{ pages: { data: Comment[] }[] }>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: [newComment, ...page.data], // ✅ tạo mảng mới
              };
            }
            return page;
          }),
        };
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo bình luận:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    },
    onSettled: () => {
      // Invalidate để đảm bảo dữ liệu luôn mới nhất, nhưng có thể bỏ qua nếu onMutate đã đủ
      // queryClient.invalidateQueries({ queryKey });
    },
  });
};
import { ActionType } from "@/hooks/react-query/comment/use-mutation-action-comment";
import axiosClient from "@/lib/axios";
import { CommonFilters, ScrollableResponse } from "@/types/api";
import { Comment, COMMENT_OBJECT_TYPE, CommentModel, TextComment } from "@/types/comment";

interface CreateCommentPayload {
  text: TextComment[];
  relateId: string;
  objectType: COMMENT_OBJECT_TYPE;
}

interface UpdateCommentPayload {
  commentId: string;
  text: TextComment[];
}

class CommentApi {
  static async fetchComments(params: CommonFilters): Promise<ScrollableResponse<Comment>> {
    try {
      const { data } = await axiosClient.get(`/comments`, { params });
      const totalRecord = data.totalRecord;
      console.log('gọi api')
      const list = data.list.map((item: Comment) => new CommentModel(item));
      return { data: list, nextCursor: data.nextCursor, totalRecord};
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Lỗi khi tải bình luận');
    }
  }

  static async createComment(payload: CreateCommentPayload): Promise<Comment> {
    const { data } = await axiosClient.post('/comments/create', payload);
    return data;
  }

  static async updateComment({ commentId, text }: UpdateCommentPayload): Promise<Comment> {
    const { data } = await axiosClient.post(`/comments/${commentId}/update`, { text });
    return data;
  }

  static async deleteComment(commentId: string): Promise<{ success: boolean }> {
    const { data } = await axiosClient.post(`/comments/${commentId}/delete`);
    return data;
  }

  static async actionComment(commentId: string, action: ActionType): Promise<any> {
    const { data } = await axiosClient.post(`/comments/${commentId}/action`, { action });
    console.log(data)
    return data;
  }
}

export default CommentApi;
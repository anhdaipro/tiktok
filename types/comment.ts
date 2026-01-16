import { UploadResponse } from "./upload";
import { User } from "./user";



export const enum COMMENT_OBJECT_TYPE {
  VIDEO = 1,
  COMMENT = 2,
}
 
export interface TextComment {
  display: string;
  type: string;
  text: string; 
}
export interface Comment {
  _id: string;
  text: TextComment[];
  images: UploadResponse[];
  parentId?: string;
  replyTo?:{
      _id: string;
      name: string
  }
  objectType: COMMENT_OBJECT_TYPE;
  author: User; // Dữ liệu người dùng đã được populate
  relateId: string; // ID của video hoặc comment cha
  createdAt: string;
  // Dữ liệu đếm, thường được tính toán ở backend
  countLike: number;
  countReply: number;
  // Trạng thái phía client
  isLiked?: boolean;
  isDisliked?: boolean;
}
export class CommentModel implements Comment {
  _id: string;
  text: TextComment[];
  images: UploadResponse[];
  objectType: COMMENT_OBJECT_TYPE;
  author: User;
  relateId: string;
  parentId?: string;
  createdAt: string;
  replyTo?:{
      _id: string;
      name: string
  }
  countLike: number;
  countReply: number;

  isLiked: boolean;
  isDisliked: boolean;

  constructor(data?: Partial<Comment>) {
    this._id = data?._id ?? '';
    this.text = data?.text ?? [];
    this.images = data?.images ?? [];
    this.objectType = data?.objectType ?? COMMENT_OBJECT_TYPE.VIDEO;
    this.author = data?.author ?? ({} as User);
    this.relateId = data?.relateId ?? '';
    this.createdAt = data?.createdAt ?? '';
    this.parentId = data?.parentId ?? '';
    this.countLike = data?.countLike ?? 0;
    this.countReply = data?.countReply ?? 0;
    this.replyTo = data?.replyTo ?? undefined
    this.isLiked = data?.isLiked ?? false;
    this.isDisliked = data?.isDisliked ?? false;
  }
}

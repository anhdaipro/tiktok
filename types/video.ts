export interface Video {
    _id: string;
    videoUrl: string;
    thumbnailUrl: string;
    caption: string;
    tags: string[];
    duration: number;
    views: number;
    music?: Music;
    createdAt: string;
    isLiked?: boolean; // Trạng thái đã thích video hay chưa
    isSaved?: boolean; // Trạng thái đã lưu video hay chưa
    isShared?: boolean; // Trạng thái đã chia sẻ video hay chưa
}
interface Music{
    name: string;
    slug: string;
    secure_url: string;
    public_id:string;
}
export interface VideoDetail{
    countLike: number;
    countComment: number;
    countShare: number;
    countSave: number;
    isLiked?: boolean; // Trạng thái đã thích video hay chưa
    isSaved?: boolean; // Trạng thái đã lưu video hay chưa
    isShared?: boolean; // Trạng thái đã chia sẻ video hay chưa
    author: {
        _id: string;
        username: string;
        name: string;
        avatar: string;
    };
}
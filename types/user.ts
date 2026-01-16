
export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  _id: string;

}
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
export interface UserStats {
  follower_count: number;
  following_count: number;
  heart_count: number;    // Tổng số lượt thích
  video_count: number;    // Tổng số video
}
// 3. Thông tin chi tiết User (Profile Header)
export interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;

  // Trạng thái tài khoản
  verification_type?: 'none' | 'yellow_tick' | 'blue_tick'; // Loại tích xanh/vàng
  is_shop?: boolean;      // Có phải tài khoản bán hàng không (để hiện tab Shop)

  // Thống kê
  follower_count: number;
  following_count: number;
  heart_count: number;    // Tổng số luien thich
  video_count: number;    // Tổng số video

  // Các liên kết ngoài (Social)
  instagram_id?: string;
  youtube_id?: string;
  website_url?: string;

  is_following: boolean;
  is_followed_by: boolean; // Follow chéo
  is_blocked: boolean;
}

// 4. Cấu trúc Response trả về từ API Next.js
export interface ProfileApiResponse {
  code: number;           // 200 success
  message: string;
  data: UserProfile;
}
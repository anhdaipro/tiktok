import { NativeModules } from "react-native";

// Định nghĩa interface cho Native Module
export interface ISystemInfo {
  // Nếu bạn dùng method getDiskInfo() trả về object { totalGB, freeMB }
  getDiskInfo(): Promise<{ totalGB: number; freeMB: number }>;
  // Nếu sau này thêm method khác, khai báo ở đây
}

// Lấy module và ép kiểu
export const SystemInfo: ISystemInfo = NativeModules.SystemInfo;
import { KEY_DEVICE_UUID } from '@/constants/key-mmkv';
import { getItem, setItem } from '@/lib/storage';
import { UploadFile, UploadResponse } from '@/types/upload';
import axios from 'axios';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { createThumbnail } from 'react-native-create-thumbnail';

import { vi } from 'date-fns/locale';
import { Video } from 'react-native-compressor';
type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
class FuncHelper {
  static async generateThumbnails(
    videoUri: string,
    duration: number,
    interval = 1 // 1s / thumb
  ) {
    const thumbnails: string[] = [];
    for (let t = 0; t < duration; t += interval) {
      const { path } = await createThumbnail(
        {
          url: videoUri,
          timeStamp: t * 1000,
        }
      );
      thumbnails.push(path);
    }

    return thumbnails;
  }
  static async compressVideo(uri: string, options?: { maxWidth?: number; maxHeight?: number; quality?: 'low' | 'medium' | 'high' }) {
    try {
      return await Video.compress(
        uri,
        {

          minimumFileSizeForCompress: 100, // MB
        },
        (progress) => console.log(progress)
      );
    } catch (e) {
      console.error('Video compress error', e);
      return uri;
    }
  }
  static checkDateIsSmallNow(isoDate: string): boolean {
    const today = new Date();
    return isAfter(today, parseISO(isoDate));
  }
  static encodePasswordBase64(password: string) {
    return Buffer.from(password, 'utf-8').toString('base64');
  }
  /**
   * Lấy mảng các ngày trong tuần hiện tại, định dạng theo "dd/MM" và "Th2, Th3,...CN".
   * Tuần bắt đầu từ Thứ Hai.
   *
   * @param {Date} currentDate - Ngày hiện tại (mặc định là new Date()).
   * @returns {Array<{date: string, day: string}>} Mảng các đối tượng chứa ngày và thứ đã định dạng.
   */
  static getFormattedWeekDates(
    currentDate: Date = new Date()
  ): Array<{ date: string; day: string }> {
    // 1. Xác định ngày bắt đầu của tuần (Thứ Hai)
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday

    // 2. Xác định ngày kết thúc của tuần (Chủ Nhật)
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

    // 3. Lấy tất cả các ngày trong khoảng thời gian này
    const weekDates = eachDayOfInterval({
      start: startOfCurrentWeek,
      end: endOfCurrentWeek,
    });

    // 4. Định dạng từng ngày theo yêu cầu
    const formattedDates = weekDates.map((date) => {
      return {
        date: format(date, 'dd/MM'), // Định dạng ngày/tháng (ví dụ: 29/07)
        day: format(date, 'EEEEE', { locale: vi }), // Định dạng thứ (ví dụ: T2, CN)
      };
    });

    return formattedDates;
  }
  static getWeekRange(date: Date = new Date()) {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Thứ 2
    const end = endOfWeek(date, { weekStartsOn: 1 }); // Chủ nhật

    return {
      startDate: start,
      endDate: end,
      startFormatted: format(start, 'dd/MM', { locale: vi }),
      endFormatted: format(end, 'dd/MM', { locale: vi }),
    };
  }

  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  static getDeviceUUID() {
    let uuid = getItem(KEY_DEVICE_UUID);
    if (!uuid) {
      uuid = this.generateUUID();
      setItem(KEY_DEVICE_UUID, uuid);
    }
    return uuid;
  }
  static async uploadToCloudinary(file: UploadFile, folder: string, resourceType: "image" | "video"): Promise<UploadResponse> {
    const cloudName = "dltj2mkhl";
    const formData = new FormData();
    formData.append("file", file as any);
    formData.append("upload_preset", "upload");
    formData.append("folder", folder); // 👈 đây là folder đích
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      formData
    );
    return data; // link ảnh
  }
  // Tiện ích chuyển đổi từ Byte sang định dạng dễ đọc (MB, GB...)
  static formatBytes(bytes: number, unit: Unit = 'MB') {
    const units: Record<Unit, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4,
    };

    return (bytes / units[unit]).toFixed(2) + ' ' + unit;
  }
}
export default FuncHelper;

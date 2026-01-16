import {
  addDays,
  differenceInDays,
  differenceInHours,
  endOfWeek,
  format,
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  parse,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { vi } from 'date-fns/locale';
export class FormatHelper {
  static formatNumber = (value: number): string => {
    const nValue = Number(value);
    const [integerPart, decimalPart] = nValue.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  static displayHistoryDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ''; // hoặc "Ngày không hợp lệ"

    if (isToday(date)) {
      return `Hôm nay, ${format(date, 'HH:mm')}`;
    }
    if (isYesterday(date)) {
      return `Hôm qua, ${format(date, 'HH:mm')}`;
    }
    return format(date, 'yyyy-MM-dd', { locale: vi });
  };
  static formatDate = (
    isoDate: string | Date,
    formatString: string = 'dd/MM/yyyy'
  ): string => {
    const date = new Date(isoDate);
    return format(date, formatString);
  };
  static addDays = (isoDate: string | Date, days: number) => {
    const day = new Date(isoDate);
    return addDays(day, days);
  };

  static formatDateTime = (
    isoDate: string,
    formatString: string = 'dd/MM/yyyy HH:mm'
  ): string => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return ''; // Hoặc xử lý ngày không hợp lệ
    }
    return format(date, formatString);
  };
  static displayDateTime(isoDate: string): string {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return ''; // Hoặc xử lý ngày không hợp lệ
    }

    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    return format(date, 'dd/MM/yyyy HH:mm');
  }

  /**
   * Lấy ngày bắt đầu và kết thúc của tuần từ một ngày cho trước.
   * Mặc định tuần bắt đầu vào Thứ Hai.
   * @param date Ngày trong tuần cần tính (mặc định là ngày hiện tại).
   * @returns Một object chứa ngày bắt đầu (start) và ngày kết thúc (end) của tuần.
   */
  static dayInWeek = (date: Date = new Date()) => {
    const start = startOfWeek(date, { weekStartsOn: 1, locale: vi }); // Tuần bắt đầu vào thứ Hai
    const end = endOfWeek(date, { weekStartsOn: 1, locale: vi });
    return { start, end };
  };

  /**
   * Tính số tuần từ một ngày cho trước đến ngày hiện tại.
   * Một phần của tuần cũng được tính là một tuần đầy đủ (làm tròn lên).
   * @param isoDate Chuỗi ngày ISO (ví dụ: '2023-10-26T10:00:00Z').
   * @returns Số tuần làm tròn lên.
   */
  static getCountWeek(isoDate: string): number {
    const today = new Date();
    const date = new Date(isoDate);
    const diffDays = Math.abs(differenceInDays(today, date));
    return Math.ceil(diffDays / 7);
  }
  /**
   * Hàm format thời gian an toàn cho cả iOS và Android
   * Input: "20/11/2025 14:30:33"
   */
  static displayTime (dateString: string | Date): string {
    let date: Date;

    // 1. Xử lý đầu vào
    if (typeof dateString === 'string') {
      // Kiểm tra xem chuỗi có phải dạng ISO (có chữ T hoặc Z) không
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = parseISO(dateString);
      } else {
        // dateString: '20/10/2025 13:44'
        // formatString: 'dd/MM/yyyy HH:mm' (Lưu ý: MM hoa là tháng, mm thường là phút)
        // new Date(): Là ngày dự phòng (backup) nếu parse lỗi
        date = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
      }
    } else {
      date = dateString;
    }

    // Kiểm tra lại lần cuối xem date có hợp lệ không (tránh crash app)
    if (isNaN(date.getTime())) {
      return 'Vừa xong'; // Hoặc giá trị mặc định
    }

    // 2. Logic hiển thị (như cũ)
    const now = new Date();
    const hoursDiff = differenceInHours(now, date);

    if (hoursDiff < 24) {
      const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
      if (diffInSeconds < 60) {
        return 'Vừa xong';
      } else if (diffInSeconds < 120) {
        return '1 phút trước';
      } else
      return formatDistanceToNowStrict(date, { addSuffix: true, locale: vi });
    } else {
      const formattedDate = format(date, 'EEEE, dd/MM/yyyy - HH:mm', { locale: vi });
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
  };
}

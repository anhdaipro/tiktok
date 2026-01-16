/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const PALETTE = {
  tiktokRed: '#FE2C55',
  tiktokCyan: '#25F4EE',
  primaryLight: '#FFEAEA',
  pink50: '#FFF5F7',
  pink200: '#FFCCD5',

  shopHeaderBg: '#E0F8F7', // Màu nền header của trang Shop
  shopExtraTagBg: 'rgba(0, 200, 188, 0.8)', // Màu tag XTRA Freeship
  white: '#FFFFFF',
  black: '#000000',
  yellow: '#FFC700', // Màu cho "Ứng dụng khác"

  // Grayscale cho Light Mode
  gray100: '#F8F8F8', // Nền phụ sáng
  gray200: '#E5E5E5', // Border sáng
  gray300: '#D9D9D9',
  gray800: '#161823', // Text chính sáng (gần đen)
  gray500: '#86878B', // Text phụ

  // Grayscale cho Dark Mode
  dark100: '#121212', // Nền phụ tối
  dark200: '#2F2F2F', // Border tối
  dark800: '#FFFFFF', // Text chính tối (trắng)
};

export const Colors = {
  // === MÀU THƯƠNG HIỆU (Dùng chung) ===
  primary: PALETTE.tiktokRed,
  secondary: PALETTE.tiktokCyan,
  gray100: '#F8F8F8', // Nền phụ sáng
  gray200: '#E5E5E5', // Border sáng
  star: '#FFC107',
  overlayMedium: 'rgba(0,0,0,0.6)',
  overlayDark: 'rgba(0,0,0,0.7)',

  gray300: PALETTE.gray300,
  gray500: PALETTE.gray500,
  gray800: PALETTE.gray800,
  shopHeaderBackground: PALETTE.shopHeaderBg,
  shopExtraTagBackground: PALETTE.shopExtraTagBg,

  // === LIGHT THEME ===
  light: {
    text: PALETTE.gray800,           // Chữ đen
    textSecondary: PALETTE.gray500,  // Chữ xám

    background: PALETTE.white,       // Nền trắng
    surface: PALETTE.gray100,        // Nền khung chat/input
    backgroundSecondary: PALETTE.gray100,
    border: PALETTE.gray200,         // Đường kẻ
    icon: PALETTE.black,             // Icon màu đen
    tabIconDefault: '#BDBDBD',
    primary: PALETTE.tiktokRed,      // Thêm màu primary
    primaryLight: PALETTE.primaryLight,
    yellow: PALETTE.yellow,          // Thêm màu vàng
    white: PALETTE.white,            // Thêm màu trắng
    tabIconSelected: PALETTE.black,
    card: '#FFFFFF', // Thêm dòng này
    voucherBackground: PALETTE.pink50,
    voucherBorder: PALETTE.pink200,
    star: '#FFC107',
    // Pagination dots
    dotActive: PALETTE.tiktokRed,
    dotInactive: 'rgba(0, 0, 0, 0.2)',
    // Semantic colors
    success: '#00BFA5',
    successLight: '#E0F2F1',
    successDark: '#00695C',
    info: '#2979FF',
    infoLight: '#E3F2FD',
    warning: '#FF9800',
    warningLight: '#FFF3E0',
    error: '#F44336',
    errorLight: '#FFEbee',
  },

  // === DARK THEME ===
  dark: {
    text: PALETTE.white,             // Chữ trắng
    textSecondary: '#A6A7AB',  // Chữ xám
    background: PALETTE.black,       // Nền đen
    surface: PALETTE.dark100,        // Nền khung chat/input tối
    backgroundSecondary: PALETTE.dark100,
    border: PALETTE.dark200,         // Đường kẻ mờ
    icon: PALETTE.white,             // Icon màu trắng
    tabIconDefault: '#555555',
    primary: PALETTE.tiktokRed,      // Thêm màu primary
    primaryLight: 'rgba(254, 44, 85, 0.2)',
    yellow: PALETTE.yellow,          // Thêm màu vàng
    white: PALETTE.white,            // Thêm màu trắng
    tabIconSelected: PALETTE.white,
    card: PALETTE.dark100, // Thêm dòng này
    voucherBackground: 'rgba(254, 44, 85, 0.1)',
    voucherBorder: 'rgba(254, 44, 85, 0.3)',
    star: '#FFC107',
    // Pagination dots
    dotActive: PALETTE.tiktokRed,
    dotInactive: 'rgba(255, 255, 255, 0.6)',
    // Semantic colors
    success: '#00BFA5',
    successLight: 'rgba(0, 191, 165, 0.15)',
    successDark: '#00BFA5',
    info: '#2979FF',
    infoLight: 'rgba(41, 121, 255, 0.15)',
    warning: '#FF9800',
    warningLight: 'rgba(255, 152, 0, 0.15)',
    error: '#F44336',
    errorLight: 'rgba(244, 67, 54, 0.15)',
  },

  // === STATIC (Luôn cố định, dùng cho Video Feed) ===
  // Vì màn hình lướt video của TikTok LUÔN là nền đen chữ trắng
  static: {
    white: PALETTE.white,
    black: PALETTE.black,
    overlay: 'rgba(0,0,0,0.5)',      // Lớp phủ đen mờ
    textShadow: {
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    bottomTabBg: '#000000', // Bottom bar của TikTok luôn đen
    tabInactive: 'rgba(255, 255, 255, 0.5)', // Màu icon/text của tab không active
    carouselIndicator: 'rgba(0,0,0,0.6)',
    white80: 'rgba(255, 255, 255, 0.8)',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

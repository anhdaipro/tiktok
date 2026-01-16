import { KEY_THEME } from '@/constants/key-mmkv';
import { Colors } from '@/constants/theme'; // File màu bạn vừa tạo
import { getItem, setItem } from '@/lib/storage';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: 'light' | 'dark';
  colors: typeof Colors.light; // Bộ màu tương ứng
  handleThemeChange: (mode: ThemeMode) => void; // Hàm đổi theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const savedTheme =  getItem(KEY_THEME);
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme(); // Lấy theme của điện thoại (iOS/Android system)
    const [themeMode, setThemeMode] = useState<ThemeMode>(savedTheme as ThemeMode ?? 'system');
    // Hàm set theme và lưu vào storage
    const handleThemeChange = async (mode: ThemeMode) => {
        setThemeMode(mode);
        setItem(KEY_THEME, mode);
    };
    const activeTheme = useMemo(() => {
        if (themeMode === 'system') {
        return systemScheme === 'dark' ? 'dark' : 'light';
        }
        return themeMode;
    }, [themeMode, systemScheme]);

  const value = useMemo(() => ({
    themeMode,
    activeTheme,
    colors: Colors[activeTheme], // Trả về bộ màu đúng (Colors.light hoặc Colors.dark)
    handleThemeChange,
  }), [themeMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook để dùng nhanh trong các component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
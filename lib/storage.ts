import { createMMKV } from 'react-native-mmkv';
// Khởi tạo MMKV storage
const storage =  createMMKV({
  id: 'tiktok-storage',
  encryptionKey: 'tiktok-storage',
});
export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.remove(key);
}


// Tạo custom storage object cho Zustand
export const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};

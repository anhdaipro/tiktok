import CustomAddButton from '@/components/tab-botton/add-button';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Tabs } from 'expo-router';
import { House, MessageSquareMore, ShoppingBag, User } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export const BOTTOM_TAB_HEIGHT = 52;
export default function TabLayout() {
  const { colors } = useTheme(); // Mặc dù tab bar là static, hook này vẫn hữu ích cho các component con nếu cần
  const styles = useMemo(() => createThemedStyles(), []);

  return (
     <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.static.bottomTabBg, // Nền đen tuyền từ theme
          borderTopWidth: 0, // Bỏ viền trên
          height: BOTTOM_TAB_HEIGHT, // Chiều cao chuẩn TikTok
          paddingBottom: 4,
        },
        tabBarActiveTintColor: Colors.static.white,
        tabBarInactiveTintColor: Colors.static.tabInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 4, // Đẩy chữ lên một chút
        },
      }}
    >
      {/* 1. Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <House 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2} 
              // Mẹo: Lucide không có icon filled chuẩn, ta dùng stroke dày hơn khi active
            />
          ),
        }}
      />

      {/* 2. Cửa hàng (Shop) */}
      <Tabs.Screen
        name="shop" // Bạn cần tạo file app/(tabs)/shop.tsx
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color, focused }) => (
            <ShoppingBag 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />

      {/* 3. Nút Tạo Video (Nút giữa) */}
      <Tabs.Screen
        name="create" // Đây thường là mở Modal, cần config trong expo-router
        options={{
          title: '',
          tabBarIcon: () => <CustomAddButton />,

          // tabBarLabelStyle: { display: 'none' }, // Ẩn nhãn text
          tabBarStyle: { display: 'none' },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Chặn chuyển tab mặc định
            // Mở màn hình Camera/Upload (thường là Modal)
            navigation.navigate('upload'); 
            console.log('Open Camera Modal');
          },
        })}
        
      />

      {/* 4. Hộp thư */}
      <Tabs.Screen
        name="inbox" // Bạn cần tạo file app/(tabs)/inbox.tsx
        options={{
          title: 'Hộp thư',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MessageSquareMore 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2.5 : 2}
              />
              {/* Badge thông báo giả lập */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>7</Text>
              </View>
            </View>
          ),
        }}
      />

      {/* 5. Hồ sơ */}
      <Tabs.Screen
        name="profile" // Bạn cần tạo file app/(tabs)/profile.tsx
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={24} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
const createThemedStyles = () => StyleSheet.create({
  // Style cho Badge thông báo (số 7 màu đỏ)
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary, // Màu đỏ từ theme
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: Colors.static.bottomTabBg, // Viền cùng màu nền tab bar
  },
  badgeText: {
    color: Colors.static.white,
    fontSize: 10,
    fontWeight: 'bold',
  }
});

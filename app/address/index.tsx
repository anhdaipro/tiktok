// d:\app\tiktok\app\address\index.tsx
import StatusBarCustom from '@/components/ui/status-bar';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useAddressStore } from '@/stores/address-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddressListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const setSelectedAddress = useAddressStore((state) => state.setSelectedAddress);
  const addresses = useAddressStore((state) => state.addresses);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBarCustom />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Địa chỉ của bạn</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => router.push('/address/form')}
        >
          <Plus size={20} color={colors.text} />
          <Text style={[styles.addBtnText, { color: colors.text }]}>Thêm địa chỉ</Text>
          <View style={{ flex: 1 }} />
          <ChevronRight size={20} color={Colors.gray500} />
        </TouchableOpacity>

        {/* List */}
        {addresses.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer}
            activeOpacity={from === 'checkout' ? 0.7 : 1}
            onPress={() => {
              if (from === 'checkout') {
                setSelectedAddress(item);
                router.back();
              }
            }}
          >
            <View style={styles.itemHeader}>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <TouchableOpacity onPress={() => router.push({ pathname: '/address/form', params: { id: item.id, data: JSON.stringify(item) } })}>
                <Text style={styles.editBtnText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.itemPhone, { color: colors.textSecondary }]}>{item.phone}</Text>
            
            <Text style={[styles.itemAddress, { color: colors.text }]}>
              {item.address}
            </Text>

            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Mặc định</Text>
              </View>
            )}
            
            {item.id === '1' && (
               <View style={styles.notificationBox}>
                 <Text style={styles.notificationText}>
                   Đã cập nhật danh sách khu vực. Chỉnh sửa địa chỉ của bạn để giao hàng chính xác.
                 </Text>
               </View>
            )}
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
    backgroundColor: '#fff',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { flex: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
  },
  addBtnText: { fontSize: 15, marginLeft: 12, fontWeight: '500' },
  itemContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray200,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: { fontSize: 15, fontWeight: '600' },
  editBtnText: { fontSize: 14, color: '#FE2C55', fontWeight: '500' },
  itemPhone: { fontSize: 13, marginBottom: 8 },
  itemAddress: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  defaultBadge: {
    backgroundColor: Colors.gray100,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: { fontSize: 11, color: '#FE2C55' },
  notificationBox: {
    marginTop: 12,
    backgroundColor: '#F1F1F2',
    padding: 12,
    borderRadius: 4,
  },
  notificationText: { fontSize: 13, color: Colors.gray500, lineHeight: 18 },
});

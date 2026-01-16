import { ProductCard } from '@/components/shop/product-card';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { MasonryFlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock Data for Recommendations
const MOCK_PRODUCTS = [
  {
    _id: '1',
    title: 'KỆ MÁY TÍNH ĐỂ BÀN LÀM VIỆC ĐA NĂNG',
    image: 'https://i.imgur.com/3Y2mYnm.png',
    price: 35000,
    originalPrice: 45000,
    sold: 2231,
    rating: 4.7,
    discount: '-22%',
    extraTag: 'XTRA Freeship',
    cod: true,
  },
  {
    _id: '2',
    title: 'Star Shop Giá đỡ Điện thoại Máy tính Bảng iPad',
    image: 'https://i.imgur.com/2Y5lw0A.png',
    price: 20900,
    originalPrice: 35000,
    sold: 1500,
    rating: 4.7,
    discount: '-40%',
    extraTag: 'XTRA Freeship',
    cod: true,
  },
  {
    _id: '3',
    title: 'Tai nghe không dây Bluetooth',
    image: 'https://i.imgur.com/gB44t2D.png',
    price: 99000,
    sold: 5000,
    rating: 4.9,
    discount: '-50%',
    cod: true,
  },
  {
    _id: '4',
    title: 'Bàn phím cơ không dây nhỏ gọn',
    image: 'https://i.imgur.com/Yf2aG4A.png',
    price: 450000,
    originalPrice: 600000,
    sold: 890,
    rating: 4.8,
    discount: '-25%',
    extraTag: 'Mall',
    cod: true,
  },
];

export default function OrderSuccessScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={styles.successSection}>
          <View style={styles.checkIconContainer}>
            <Check size={32} color="white" strokeWidth={3} />
          </View>
          <Text style={styles.successTitle}>Cảm ơn bạn đã đặt hàng!</Text>
          <Text style={styles.successSub}>
            Bạn sẽ nhận cập nhật trong phần thông báo ở hộp thư đến.
          </Text>

          <TouchableOpacity
            style={styles.viewOrderBtn}
            onPress={() => router.push('/order/detail')}
          >
            <Text style={styles.viewOrderText}>Xem đơn hàng</Text>
          </TouchableOpacity>
        </View>

        {/* Voucher Section */}
        <View style={styles.voucherSection}>
          <View style={styles.voucherHeader}>
            <View style={styles.divider} />
            <Text style={styles.voucherTitle}>Bạn có <Text style={{ color: '#FE2C55' }}>5 voucher</Text> độc quyền</Text>
            <View style={styles.divider} />
          </View>
          <Text style={styles.totalDiscount}>Giảm tổng cộng <Text style={{ color: '#FE2C55' }}>3.050.000đ</Text></Text>

          {/* Voucher List */}
          <View style={styles.voucherList}>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.voucherCard}>
                <View style={styles.voucherContent}>
                  <Text style={styles.voucherPercent}>Giảm 30%</Text>
                  <Text style={styles.voucherCondition}>cho đơn trên {index === 0 ? '99K' : '300K'} đ</Text>
                </View>
                {/* Decorative dots */}
                <View style={[styles.dot, styles.dotLeft]} />
                <View style={[styles.dot, styles.dotRight]} />
              </View>
            ))}
          </View>

          <View style={styles.moreVoucher}>
            <Text style={styles.moreVoucherText}>+3 voucher khác</Text>
          </View>

          <TouchableOpacity style={styles.claimBtn}>
            <Text style={styles.claimBtnText}>Nhận và mua sắm ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Email Notification */}
        <View style={styles.emailSection}>
          <View style={styles.emailRow}>
            <Text style={styles.emailTitle}>Nhận thông tin cập nhật qua email</Text>
            <Switch
              value={emailNotif}
              onValueChange={setEmailNotif}
              trackColor={{ false: '#767577', true: '#FE2C55' }}
              thumbColor={'#fff'}
            />
          </View>
          <Text style={styles.emailDesc}>
            Bật lựa chọn này nghĩa là bạn đồng ý nhận email cập nhật đơn hàng và thông tin khuyến mãi thông qua email liên kết với tài khoản TikTok của bạn là d***2@gmail.com
          </Text>
        </View>

        {/* Recommendations */}
        <Text style={styles.recommendTitle}>Có thể bạn cũng thích</Text>
        <View style={{ paddingHorizontal: 12 }}>
          <MasonryFlashList
            data={MOCK_PRODUCTS}
            numColumns={2}
            renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
            estimatedItemSize={250}
            scrollEnabled={false}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { padding: 4 },
  content: { flex: 1 },

  successSection: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 10, paddingBottom: 30 },
  checkIconContainer: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#00C898',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
  successSub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  viewOrderBtn: {
    backgroundColor: '#F1F1F2', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 4, width: '100%', alignItems: 'center'
  },
  viewOrderText: { fontSize: 15, fontWeight: '600', color: colors.text },

  voucherSection: { paddingHorizontal: 16, paddingBottom: 24 },
  voucherHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#E5E5E5', flex: 1 },
  voucherTitle: { marginHorizontal: 8, fontSize: 13, fontWeight: '600', color: colors.text },
  totalDiscount: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: colors.text },

  voucherList: { gap: 10 },
  voucherCard: {
    backgroundColor: '#FFF0F5', // Light pink
    borderWidth: 1, borderColor: '#FFD6E0',
    borderRadius: 8, padding: 16, alignItems: 'center',
    position: 'relative',
  },
  voucherContent: { alignItems: 'center' },
  voucherPercent: { fontSize: 16, fontWeight: 'bold', color: '#FE2C55', marginBottom: 4 },
  voucherCondition: { fontSize: 12, color: colors.textSecondary },
  dot: {
    position: 'absolute', top: '50%', marginTop: -6,
    width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#FFD6E0',
  },
  dotLeft: { left: -6, borderRightColor: 'transparent', borderTopColor: 'transparent', transform: [{ rotate: '45deg' }] }, // Simple hack for cutout look
  dotRight: { right: -6 },

  moreVoucher: {
    backgroundColor: '#FE2C55', paddingVertical: 8, alignItems: 'center',
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginTop: -4, zIndex: -1
  },
  moreVoucherText: { color: 'white', fontSize: 12, fontWeight: '600' },

  claimBtn: {
    backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E5E5',
    paddingVertical: 12, borderRadius: 24, alignItems: 'center', marginTop: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  claimBtnText: { fontSize: 15, fontWeight: '600', color: '#FE2C55' },

  emailSection: { padding: 16, borderTopWidth: 8, borderTopColor: '#F8F8F8' },
  emailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  emailTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  emailDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  recommendTitle: { fontSize: 16, fontWeight: '600', padding: 16, color: colors.text },
});
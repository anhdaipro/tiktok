import { CheckoutFooter } from '@/components/checkout/checkout-footer';
import { CheckoutPaymentMethod } from '@/components/checkout/checkout-payment-method';
import { CheckoutShopItem } from '@/components/checkout/checkout-shop-item';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useAddressStore } from '@/stores/address-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, MapPin, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data } = useLocalSearchParams<{ data: string }>();
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const addresses = useAddressStore((state) => state.addresses);
  const setSelectedAddress = useAddressStore((state) => state.setSelectedAddress);

  // Parse data passed from Cart
  const checkoutShops = useMemo(() => {
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }, [data]);

  // Calculate totals
  const { subtotal, shipping, discount, total, totalItems } = useMemo(() => {
    let sub = 0;
    let ship = 0;
    let count = 0;

    checkoutShops.forEach((shop: any) => {
      // Mock shipping fee: 30,200 per shop
      ship += 30200;
      shop.items.forEach((item: any) => {
        sub += item.price * item.quantity;
        count += item.quantity;
      });
    });

    // Mock discount logic (e.g. 15k off if subtotal > 100k)
    const disc = sub > 100000 ? 15000 : 0;
    const tot = sub + ship - disc;

    return { subtotal: sub, shipping: ship, discount: disc, total: tot, totalItems: count };
  }, [checkoutShops]);

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [selectedAddress, addresses, setSelectedAddress]);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ nhận hàng để tiếp tục.');
      return;
    }
    router.push('/order/success');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <FlexBox direction="row" align="center" style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', marginRight: 40 }}>
            <Text style={styles.headerTitle}>Tóm tắt yêu cầu</Text>
            <FlexBox direction="row" align="center" gap={4}>
                <ShieldCheck size={12} color="#00BFA5" />
                <Text style={styles.headerSub}>Hủy đơn dễ dàng</Text>
            </FlexBox>
          </View>
        </FlexBox>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.addressSection}
          onPress={() => router.push({ pathname: '/address', params: { from: 'checkout' } })}
        >
          <FlexBox direction="row" align="flex-start" gap={12}>
             <MapPin size={20} color={colors.primary} style={{marginTop: 2}} />
             <View style={{flex: 1}}>
                <Text style={styles.addressLabel}>Địa chỉ nhận hàng</Text>
                
                {selectedAddress ? (
                   <>
                      <Text style={styles.addressInfo}>{selectedAddress.name} | {selectedAddress.phone}</Text>
                      <Text style={styles.addressDetail} numberOfLines={2}>{selectedAddress.address}</Text>
                   </>
                ) : (
                   <Text style={styles.addressPlaceholder}>Vui lòng chọn địa chỉ nhận hàng</Text>
                )}
             </View>
             <ChevronRight size={20} color={Colors.gray500} style={{alignSelf: 'center'}} />
          </FlexBox>
        </TouchableOpacity>
        
        {checkoutShops.map((shop: any) => (
          <CheckoutShopItem key={shop.id} shop={shop} />
        ))}

        <CheckoutSummary 
        />
        <CheckoutPaymentMethod />
      </ScrollView>

      <CheckoutFooter 
        total={total}
        savings={0}
        onPlaceOrder={handlePlaceOrder}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerContent: {
    height: 50,
    paddingHorizontal: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSub: { fontSize: 12, color: '#00BFA5' },
  scrollContent: { paddingBottom: 20 },
  addressSection: {
    backgroundColor: colors.background,
    padding: 16,
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  addressInfo: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  addressPlaceholder: {
    fontSize: 14,
    color: '#FE2C55',
  },
});
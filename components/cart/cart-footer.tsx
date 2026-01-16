import FlexBox from '@/components/common/flex-box';
import { Checkbox } from '@/components/ui/checkbox';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Ticket } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartFooterProps {
  totalPrice: number;
  isAllSelected: boolean;
  onToggleAll: () => void;
  onCheckout: () => void;
}

const CartFooter: React.FC<CartFooterProps> = ({
  totalPrice,
  isAllSelected,
  onToggleAll,
  onCheckout,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleCheckout = () => {
    router.push('/checkout');
  }

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            {/* Voucher Row */}
            <TouchableOpacity style={styles.voucherRow}>
                <FlexBox direction="row" align="center" gap={8}>
                    <Ticket size={20} color={Colors.primary} />
                    <Text style={styles.voucherTitle}>Tất cả voucher</Text>
                </FlexBox>
                <Text style={styles.voucherHint}>Chọn hoặc nhập mã {'>'}</Text>
            </TouchableOpacity>

            {/* Action Row */}
            <View style={styles.actionRow}>
                <FlexBox direction="row" align="center" gap={8} style={styles.selectAll}>
                    <Checkbox checked={isAllSelected} onPress={onToggleAll} />
                    <Text style={styles.selectAllText}>Tất cả</Text>
                </FlexBox>

                <FlexBox direction="row" align="center" gap={12}>
                    <View style={styles.totalInfo}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString('vi-VN')}₫</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                        <Text style={styles.checkoutBtnText}>Thanh toán</Text>
                    </TouchableOpacity>
                </FlexBox>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray200,
    },
    voucherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray100,
    },
    voucherTitle: {
        fontSize: 14,
        color: Colors.gray800,
        fontWeight: '500',
    },
    voucherHint: {
        fontSize: 12,
        color: Colors.gray500,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 10,
    },
    selectAll: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: 14,
        color: Colors.gray500,
        marginLeft: 4
    },
    totalInfo: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        color: Colors.gray800,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
    },
    checkoutBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default CartFooter
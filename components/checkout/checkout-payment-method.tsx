import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, Info } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PaymentOptionsModal from './popup-payment-options';

export const CheckoutPaymentMethod = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selectedMethod, setSelectedMethod] = useState('cod');
  const { showModal, hideModal } = useModal();

  const renderRadio = (value: string) => (
    <View style={[styles.radio, selectedMethod === value && styles.radioSelected]}>
      {selectedMethod === value && <View style={styles.radioInner} />}
    </View>
  );

  const handleOpenOptions = () => {
    showModal({
      content: (
        <PaymentOptionsModal
          selected={selectedMethod}
          onSelect={(method) => {
            setSelectedMethod(method);
            hideModal();
          }}
          onClose={() => hideModal()}
        />
      ),
      animationType: 'slide-bottom',
      styleModalContent: { justifyContent: 'flex-end', margin: 0 },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>

      {/* COD */}
      <TouchableOpacity 
        style={styles.methodRow} 
        onPress={() => setSelectedMethod('cod')}
        activeOpacity={0.7}
      >
        <FlexBox direction="row" align="flex-start" style={{ flex: 1 }}>
            <View style={styles.codBadge}><Text style={styles.codText}>COD</Text></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <FlexBox direction="row" align="center" gap={4}>
                    <Text style={styles.methodName}>Thanh toán khi giao</Text>
                    <Info size={14} color={Colors.gray500} />
                </FlexBox>
            </View>
        </FlexBox>
        {renderRadio('cod')}
      </TouchableOpacity>

      {/* ZaloPay */}
      <TouchableOpacity 
        style={styles.methodRow} 
        onPress={() => setSelectedMethod('zalopay')}
        activeOpacity={0.7}
      >
        <FlexBox direction="row" align="flex-start" style={{ flex: 1 }}>
            <View style={styles.logoPlaceholder}><Text style={{fontSize: 8, color: '#0068FF', fontWeight: 'bold'}}>ZaloPay</Text></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <FlexBox direction="row" justify="space-between" align="center">
                    <Text style={styles.methodName}>ZaloPay</Text>
                    <TouchableOpacity>
                        <FlexBox direction="row" align="center">
                            <Text style={styles.linkText}>Liên kết</Text>
                            <ChevronRight size={14} color={Colors.primary} />
                        </FlexBox>
                    </TouchableOpacity>
                </FlexBox>
                <View style={styles.promoTag}>
                    <Text style={styles.promoText}>Giảm 10000₫ cho đơn trên 80000₫ với Zalopay</Text>
                </View>
                <Text style={styles.description}>
                    Liên kết tài khoản Zalopay của bạn với TikTok Shop và thử tính năng thanh toán không cần mật khẩu
                </Text>
            </View>
        </FlexBox>
        {renderRadio('zalopay')}
      </TouchableOpacity>

      {/* MoMo */}
      <TouchableOpacity 
        style={styles.methodRow} 
        onPress={() => setSelectedMethod('momo')}
        activeOpacity={0.7}
      >
        <FlexBox direction="row" align="flex-start" style={{ flex: 1 }}>
             <View style={[styles.logoPlaceholder, {backgroundColor: '#A50064'}]}><Text style={{fontSize: 8, color: '#fff', fontWeight: 'bold'}}>MoMo</Text></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.methodName}>Ví điện tử MoMo</Text>
                <View style={styles.promoTag}>
                    <Text style={styles.promoText}>Giảm 8000₫ với Ví điện tử MoMo</Text>
                </View>
                <Text style={styles.description}>
                    Liên kết tài khoản Ví điện tử MoMo của bạn với TikTok Shop và thanh toán trực tiếp
                </Text>
            </View>
        </FlexBox>
        {renderRadio('momo')}
      </TouchableOpacity>

      {/* View All Button */}
      <TouchableOpacity style={styles.viewAllBtn} onPress={handleOpenOptions}>
        <Text style={styles.viewAllText}>Xem tất cả tùy chọn</Text>
        <ChevronRight size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};



const createStyles = (colors: any) => StyleSheet.create({
  container: { backgroundColor: colors.background, 
    padding: 16, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', 
    color: colors.text, marginBottom: 16 },
  methodRow: { flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'space-between', marginBottom: 20 
  },
  codBadge: { 
    backgroundColor: '#4CAF50', 
    paddingHorizontal: 6, paddingVertical: 2, 
    borderRadius: 2, width: 36, alignItems: 'center' 
  },
  codText: { 
    color: '#fff', fontSize: 10, 
    fontWeight: 'bold' 

  },
  logoPlaceholder: { 
    width: 36, height: 36, borderRadius: 4, 
    backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' 
  },
  methodName: { 
    fontSize: 14, color: colors.text, fontWeight: '500' 

  },
  linkText: { 
    fontSize: 13, color: Colors.primary 

  },
  promoTag: { 
    backgroundColor: 'rgba(255, 66, 79, 0.1)', 
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, 
    marginTop: 4, alignSelf: 'flex-start' },
  promoText: { fontSize: 11, color: Colors.primary 

  },
  description: { 
    fontSize: 12, color: colors.textSecondary, 
    marginTop: 4, lineHeight: 16 

  },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, 
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center' 
  },
  radioSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary 

  },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' 

  },
  viewAllBtn: { 
    flexDirection: 'row', alignItems: 'center', 
    justifyContent: 'center', marginTop: 10, paddingVertical: 8 
  },
  viewAllText: { 
    fontSize: 13, 
    color: colors.textSecondary, marginRight: 4 
  },
});

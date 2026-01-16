import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, CreditCard, Landmark, ShieldCheck, X } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentOptionsModal = ({ selected, onSelect, onClose }: { selected: string, onSelect: (val: string) => void, onClose: () => void }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createModalStyles(colors), [colors]);

  const renderRadio = (value: string) => (
    <View style={[styles.radio, selected === value && styles.radioSelected]}>
      {selected === value && <View style={styles.radioInner} />}
    </View>
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.securityNote}>
        <ShieldCheck size={14} color="#00BFA5" />
        <Text style={styles.securityText}>Thông tin của bạn được bảo mật và mã hóa</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '80%' }}>
        {/* COD */}
        <TouchableOpacity style={styles.optionRow} onPress={() => onSelect('cod')}>
            <FlexBox direction="row" align="center" gap={12}>
                <View style={styles.codBadge}><Text style={styles.codText}>COD</Text></View>
                <Text style={styles.optionName}>Thanh toán khi giao</Text>
            </FlexBox>
            {renderRadio('cod')}
        </TouchableOpacity>

        {/* ZaloPay */}
        <TouchableOpacity style={styles.optionRow} onPress={() => onSelect('zalopay')}>
            <FlexBox direction="row" align="flex-start" gap={12} style={{flex: 1}}>
                <View style={styles.logoPlaceholder}><Text style={{fontSize: 8, color: '#0068FF', fontWeight: 'bold'}}>ZaloPay</Text></View>
                <View style={{flex: 1}}>
                    <FlexBox direction="row" justify="space-between">
                        <Text style={styles.optionName}>ZaloPay</Text>
                        <Text style={styles.linkText}>Liên kết {'>'}</Text>
                    </FlexBox>
                    <View style={styles.promoTag}><Text style={styles.promoText}>Giảm 10000₫ cho đơn trên 80000₫ với Zalopay</Text></View>
                    <Text style={styles.desc}>Liên kết tài khoản Zalopay của bạn với TikTok Shop và thử tính năng thanh toán không cần mật khẩu</Text>
                </View>
            </FlexBox>
            {renderRadio('zalopay')}
        </TouchableOpacity>

        {/* MoMo */}
        <TouchableOpacity style={styles.optionRow} onPress={() => onSelect('momo')}>
            <FlexBox direction="row" align="flex-start" gap={12} style={{flex: 1}}>
                <View style={[styles.logoPlaceholder, {backgroundColor: '#A50064'}]}><Text style={{fontSize: 8, color: '#fff', fontWeight: 'bold'}}>MoMo</Text></View>
                <View style={{flex: 1}}>
                    <Text style={styles.optionName}>Ví điện tử MoMo</Text>
                    <View style={styles.promoTag}><Text style={styles.promoText}>Giảm 8000₫ với Ví điện tử MoMo</Text></View>
                    <Text style={styles.desc}>Liên kết tài khoản Ví điện tử MoMo của bạn với TikTok Shop và thanh toán trực tiếp</Text>
                </View>
            </FlexBox>
            {renderRadio('momo')}
        </TouchableOpacity>

        {/* Add Card */}
        <TouchableOpacity style={styles.optionRow}>
            <FlexBox direction="row" align="center" gap={12}>
                <View style={styles.iconBox}><Text style={{fontSize: 20, color: colors.textSecondary}}>+</Text></View>
                <View>
                    <Text style={styles.optionName}>Thêm thẻ tín dụng/thẻ ghi nợ</Text>
                    <FlexBox direction="row" gap={4} style={{marginTop: 4}}>
                         <View style={{width: 24, height: 16, backgroundColor: '#f0f0f0', borderRadius: 2, alignItems:'center', justifyContent:'center'}}><Text style={{fontSize: 6, fontWeight:'bold', color: '#1A1F71'}}>VISA</Text></View>
                    </FlexBox>
                </View>
            </FlexBox>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* ATM */}
        <TouchableOpacity style={styles.optionRow}>
            <FlexBox direction="row" align="center" gap={12}>
                <View style={styles.iconBox}><CreditCard size={20} color={colors.textSecondary} /></View>
                <Text style={styles.optionName}>Thẻ ATM nội địa</Text>
            </FlexBox>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Banking */}
        <TouchableOpacity style={styles.optionRow}>
            <FlexBox direction="row" align="center" gap={12}>
                <View style={styles.iconBox}><Landmark size={20} color={colors.textSecondary} /></View>
                <Text style={styles.optionName}>Ngân hàng di động</Text>
            </FlexBox>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};
export default PaymentOptionsModal;
const createModalStyles = (colors: any) => StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingBottom: 20,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        backgroundColor: 'rgba(0, 191, 165, 0.1)',
    },
    securityText: { fontSize: 12, color: '#00BFA5' },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
    },
    codBadge: { backgroundColor: '#4CAF50', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, width: 36, alignItems: 'center' },
    codText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    logoPlaceholder: { width: 36, height: 36, borderRadius: 4, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
    optionName: { fontSize: 14, fontWeight: '500', color: colors.text },
    linkText: { fontSize: 13, color: Colors.primary },
    promoTag: { backgroundColor: 'rgba(255, 66, 79, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, marginTop: 4, alignSelf: 'flex-start' },
    promoText: { fontSize: 11, color: Colors.primary },
    desc: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 16 },
    iconBox: { width: 36, alignItems: 'center' },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    radioSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
    radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
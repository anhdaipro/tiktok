import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight, MapPin } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AddressStripe = () => {
  // Tạo dải màu xanh đỏ giả lập phong bì thư
  const items = Array.from({ length: 20 });
  return (
    <View style={{ flexDirection: 'row', height: 3, width: '100%', overflow: 'hidden' }}>
      {items.map((_, i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 3,
            backgroundColor: i % 2 === 0 ? '#3ad1e6' : '#fe2c55',
            transform: [{ skewX: '-20deg' }],
            marginRight: 4,
          }}
        />
      ))}
    </View>
  );
};

export const CheckoutAddress = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.container}>
      <FlexBox direction="row" align="flex-start" gap={10} style={styles.content}>
        <MapPin size={18} color={Colors.gray800} style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <FlexBox direction="row" align="center" gap={8} style={{ marginBottom: 4 }}>
            <Text style={styles.name}>Phạm Đại</Text>
            <Text style={styles.phone}>(+84)03******10</Text>
          </FlexBox>
          <Text style={styles.address} numberOfLines={3}>
            Công Ty Cổ Phần Dầu Khí Miền Nam, 86 Đường Nguyễn Cửu Vân, Phường 17, không giao vào chi...
          </Text>
          <Text style={styles.subAddress}>Phường 17, Hồ Chí Minh, Việt Nam</Text>
        </View>
        <ChevronRight size={20} color={Colors.gray500} style={{ alignSelf: 'center' }} />
      </FlexBox>
      <AddressStripe />
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  phone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  address: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  subAddress: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
});
// d:\app\tiktok\app\address\form.tsx
import { RegionPicker } from '@/components/address/region-picker';
import StatusBarCustom from '@/components/ui/status-bar';
import CustomSwitch from '@/components/ui/switch';
import { Colors } from '@/constants/theme';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Info, MapPin, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  region: z.string().min(1, 'Vui lòng chọn địa chỉ'),
  detail: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddressFormScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, data } = useLocalSearchParams<{ id: string; data: string }>();
  const isEdit = !!id;
  const { showModal, hideModal } = useModal();
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      region: '',
      detail: '',
      isDefault: false,
    }
  });

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address && address.length > 0) {
        const currentAddress = address[0];
        const city = currentAddress.city || currentAddress.region || '';
        const district = currentAddress.subregion || currentAddress.district || '';
        const street = currentAddress.street || '';
        const streetNumber = currentAddress.name || '';

        setValue('region', [district, city].filter(Boolean).join(', '));
        setValue('detail', [streetNumber, street].filter(Boolean).join(' '));
      }
    } catch (error) {
      console.log('Error reverse geocoding', error);
    }
  };

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setValue('name', parsed.name);
        // Clean phone number for input
        setValue('phone', parsed.phone.replace(/[^0-9]/g, ''));
        setValue('region', 'Tân Lập, Bình Phước'); // Mock region
        setValue('detail', parsed.address);
        setValue('isDefault', parsed.isDefault);
      } catch (e) {
        console.log('Error parsing data', e);
      }
    }
  }, [data]);

  const onSubmit = (data: FormData) => {
    console.log('Submit:', data);
    router.back();
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cho phép truy cập vị trí trong cài đặt để sử dụng tính năng này.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      await reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại.');
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBarCustom />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </Text>
        {isEdit ? (
          <TouchableOpacity style={styles.deleteBtn}>
            <Trash2 size={20} color={colors.text} />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Tên</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder="Nhập tên"
                placeholderTextColor={Colors.gray500}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Số điện thoại</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.prefix}>
              <Text style={{ color: colors.text }}>VN +84</Text>
              <View style={styles.verticalDivider} />
            </View>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { flex: 1, color: colors.text }]}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor={Colors.gray500}
                />
              )}
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
        </View>

        {/* Region */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Địa chỉ</Text>
          <Controller
            control={control}
            name="region"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  showModal({
                    content: (
                      <RegionPicker
                        onSelect={(address) => onChange(address)}
                        onClose={hideModal}
                      />
                    ),
                    animationType: 'slide-bottom',
                    styleModalContent: { justifyContent: 'flex-end', margin: 0 }
                  });
                }}
              >
                <Text style={[styles.selectorText, !value && { color: Colors.gray500 }]}>
                  {value || 'Chọn địa chỉ'}
                </Text>
                <ChevronRight size={20} color={Colors.gray500} />
              </TouchableOpacity>
            )}
          />
          {errors.region && <Text style={styles.errorText}>{errors.region.message}</Text>}

          {/* Map Hint */}
          {!coordinates ? (
            <View style={styles.mapHint}>
              <MapPin size={16} color="#00BFA5" />
              <Text style={styles.mapHintText}>Cho phép truy cập vị trí để tự động điền địa chỉ</Text>
              <TouchableOpacity style={styles.allowBtn} onPress={handleGetCurrentLocation} disabled={isLocating}>
                {isLocating ? (
                  <ActivityIndicator size="small" color={Colors.gray800} />
                ) : (
                  <Text style={styles.allowBtnText}>Cho phép</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.mapSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 }}>
                <Info size={16} color={colors.text} />
                <Text style={{ fontSize: 13, color: colors.text }}>Xác nhận vị trí trên bản đồ</Text>
              </View>
              <View style={styles.mapWrapper}>
                <MapView
                  style={styles.map}
                  region={coordinates}
                  onRegionChangeComplete={(region) => {
                    setCoordinates(region);
                    reverseGeocode(region.latitude, region.longitude);
                  }}
                >
                  <Marker
                    coordinate={coordinates}
                    draggable
                    onDragEnd={(e) => {
                      const { latitude, longitude } = e.nativeEvent.coordinate;
                      setCoordinates(prev => prev ? ({ ...prev, latitude, longitude }) : null);
                    }}
                  />
                </MapView>
              </View>
            </View>
          )}
        </View>

        {/* Detail */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Chi tiết địa chỉ</Text>
          <Controller
            control={control}
            name="detail"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={value}
                onChangeText={onChange}
                placeholder="Nhập các chi tiết khác (không bắt buộc)"
                placeholderTextColor={Colors.gray500}
              />
            )}
          />
        </View>

        {/* Default Switch */}
        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: colors.text, marginBottom: 0 }]}>Đặt làm mặc định</Text>
          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, value } }) => (
              <CustomSwitch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {/* Privacy Note */}
        <Text style={styles.privacyNote}>
          Nhấp vào Lưu nghĩa là bạn xác nhận đã đọc <Text style={{ fontWeight: 'bold' }}>Chính sách quyền riêng tư</Text>.
        </Text>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitBtnText}>Lưu</Text>
        </TouchableOpacity>

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
  deleteBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: '#F1F1F2',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F2',
    borderRadius: 4,
    height: 44,
    alignItems: 'center',
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.gray200,
    marginLeft: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F2',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
  },
  selectorText: { fontSize: 15 },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
  mapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
    gap: 8
  },
  mapHintText: { flex: 1, fontSize: 12, color: Colors.gray800 },
  allowBtn: { backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  allowBtnText: { fontSize: 12, fontWeight: '500' },
  mapSection: {
    marginTop: 12,
  },
  mapWrapper: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  map: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  privacyNote: {
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#FE2C55',
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

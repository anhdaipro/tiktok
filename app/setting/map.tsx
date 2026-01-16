import AdvancedFPSDisplay from '@/components/advanced-fps-display';
import HeaderNavigate from '@/components/layout/header';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';


const RADIUS_METERS = 3000; // 3km
// Định nghĩa ngưỡng zoom để hiển thị (Ví dụ: 0.5 độ)
const ZOOM_THRESHOLD = 0.5;
// 1. Component con được tối ưu với React.memo
// tracksViewChanges={false} là chìa khóa để marker không bị render lại liên tục
const MapItem = React.memo(({ item }: { item: any }) => {
    return (
        <>
            <Marker
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                tracksViewChanges={false} // Cực kỳ quan trọng cho hiệu năng
            >
                {/* ⭐ Callout - Popup khi click marker */}
                <Callout onPress={() => console.log('Callout pressed:', item.id)}>
                    <View style={{ padding: 10, minWidth: 150 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
                            Location {item.id}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            Lat: {item.latitude.toFixed(4)}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            Lng: {item.longitude.toFixed(4)}
                        </Text>
                    </View>
                </Callout>
            </Marker>
            <Circle
                center={{ latitude: item.latitude, longitude: item.longitude }}
                radius={RADIUS_METERS}
                strokeWidth={1}
                strokeColor="rgba(0, 150, 255, 0.5)"
                fillColor="rgba(0, 150, 255, 0.15)"
            />
        </>
    );
});

export default function OptimizedMap() {
    const mapRef = useRef<MapView>(null); // ⭐ Ref cho MapView
    const [visibleItems, setVisibleItems] = useState<typeof DATA>([]);  // ← Khởi tạo empty
    const [isActive, setIsActive] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Dùng useMemo để fix cứng dữ liệu, không bị random lại
    const DATA = useMemo(() => {
        console.log("--- Khởi tạo DATA (Chỉ chạy 1 lần) ---");
        return Array.from({ length: 100 }).map((_, i) => ({
            id: `id-${i}`,
            latitude: 10.6 + Math.random() * (11.0 - 10.6),
            
            longitude: 106.5 + Math.random() * (107.0 - 106.5),
        }));
    }, []); // Dependency rỗng = không bao giờ tạo lại

    // Get user location
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    // ⭐ Auto-center map khi có user location
    useEffect(() => {
        if (userLocation && mapRef.current && isMapLoaded) {
            mapRef.current?.animateToRegion({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000); // 1 giây animation
        }
    }, [userLocation, isMapLoaded]);

    useFocusEffect(
        useCallback(() => {
            // Khi vào màn hình: Kích hoạt render các thành phần nặng
            setIsActive(true);
            setVisibleItems(DATA);
            return () => {
                // Khi rời màn hình: "Giải phóng" bớt các thành phần nặng
                setIsActive(false);
            };
        }, [])
    );

    // 2. Hàm lọc các điểm nằm trong vùng nhìn thấy
    const handleRegionChangeComplete = useCallback((region: Region) => {
        console.log("--- handleRegionChangeComplete ---", region.latitudeDelta);
        // BƯỚC 1: Kiểm tra mức độ zoom
        // Nếu latitudeDelta lớn hơn ngưỡng, xóa sạch danh sách hiển thị để giải phóng tài nguyên
        if (region.latitudeDelta > ZOOM_THRESHOLD) {

            console.log("--- Xóa sạch danh sách hiển thị ---");
            setVisibleItems([]); // Ẩn hết khi zoom quá xa

            return;
        }

        // BƯỚC 2: Nếu zoom đủ gần, mới chạy logic lọc theo tọa độ
        const buffer = 0.02;
        const minLat = region.latitude - region.latitudeDelta / 2 - buffer;
        const maxLat = region.latitude + region.latitudeDelta / 2 + buffer;
        const minLng = region.longitude - region.longitudeDelta / 2 - buffer;
        const maxLng = region.longitude + region.longitudeDelta / 2 + buffer;

        const filtered = DATA.filter(
            (item) =>
                item.latitude >= minLat &&
                item.latitude <= maxLat &&
                item.longitude >= minLng &&
                item.longitude <= maxLng
        );

        setVisibleItems(filtered);
    }, [visibleItems.length]);
    console.log('visibleItems', visibleItems.length);

    return (
        <View style={styles.container}>
            <StatusBarCustom />
            <AdvancedFPSDisplay />
            <HeaderNavigate title="Bản đồ" />
            <View>
                <Text style={{ color: colors.text }}>visibleItems: {visibleItems.length}</Text>
            </View>
            <MapView
                ref={mapRef} // ⭐ Add ref
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: userLocation?.latitude || 10.762622,
                    longitude: userLocation?.longitude || 106.660172,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onMapLoaded={() => setIsMapLoaded(true)}  // 👈 cái này ok nhất

                // Chỉ chạy logic lọc khi người dùng đã ngừng di chuyển bản đồ
                // onRegionChangeComplete={handleRegionChangeComplete}
                // Giảm tần suất cập nhật để mượt hơn
                maxDelta={0.5}
            >
                {/* ⭐ User Location Marker - Custom icon */}
                {userLocation && (
                    <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
                        <MapPin size={40} color={colors.primary} />
                        <Callout>
                            <View style={{ padding: 10, minWidth: 150 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Vị trí của bạn</Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>
                                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                                </Text>
                            </View>
                        </Callout>
                    </Marker>
                )}

                {/* Data markers */}
                {isActive && visibleItems.map(item => (
                    <MapItem key={item.id} item={item} />
                ))}
            </MapView>
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        map: { width: Dimensions.get('window').width, flex: 1 },
        callout: {
            padding: 10,
            minWidth: 150,
        },
        calloutTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        calloutText: {
            fontSize: 12,
            color: '#666',
        },
    });
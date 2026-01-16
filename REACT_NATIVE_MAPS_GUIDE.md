# 🗺️ React Native Maps - Usage Guide

## 📦 Installation

```bash
npx expo install react-native-maps
```

---

## 🎯 Core Components

### 1. **MapView** (Main Component)

```tsx
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

<MapView
  provider={PROVIDER_GOOGLE} // Google Maps
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 10.762622,    // Tọa độ trung tâm
    longitude: 106.660172,
    latitudeDelta: 0.05,    // Zoom level (càng nhỏ = zoom càng gần)
    longitudeDelta: 0.05,
  }}
  onRegionChangeComplete={(region) => console.log(region)}
/>
```

**Props quan trọng:**
- `provider`: `PROVIDER_GOOGLE` (Android/iOS) hoặc `PROVIDER_DEFAULT` (Apple Maps trên iOS)
- `initialRegion`: Vị trí và zoom ban đầu
- `region`: Controlled region (dùng khi cần control từ code)
- `onRegionChange`: Callback khi đang move map
- `onRegionChangeComplete`: Callback khi ngừng move map
- `showsUserLocation`: Hiện vị trí user (cần permission)
- `followsUserLocation`: Auto center vào user
- `mapType`: `'standard' | 'satellite' | 'hybrid' | 'terrain'`

---

### 2. **Marker** (Điểm đánh dấu)

```tsx
import { Marker } from 'react-native-maps';

<Marker
  coordinate={{
    latitude: 10.762622,
    longitude: 106.660172,
  }}
  title="Tiêu đề"
  description="Mô tả chi tiết"
  onPress={() => console.log('Marker pressed')}
  tracksViewChanges={false} // ⚡ Performance: không re-render
>
  {/* Custom marker view */}
  <View style={styles.customMarker}>
    <Image source={require('./pin.png')} />
  </View>
</Marker>
```

**Props quan trọng:**
- `coordinate`: Tọa độ { latitude, longitude }
- `title`: Tiêu đề (hiện khi tap)
- `description`: Mô tả
- `image`: Custom marker image
- `anchor`: Điểm neo { x, y } (default: { x: 0.5, y: 1 })
- `tracksViewChanges`: `false` để tối ưu performance
- `draggable`: Cho phép kéo marker

---

### 3. **Circle** (Vòng tròn)

```tsx
import { Circle } from 'react-native-maps';

<Circle
  center={{
    latitude: 10.762622,
    longitude: 106.660172,
  }}
  radius={3000} // Bán kính (meters)
  strokeWidth={2}
  strokeColor="rgba(0, 150, 255, 0.8)"
  fillColor="rgba(0, 150, 255, 0.2)"
/>
```

**Props quan trọng:**
- `center`: Tâm vòng tròn
- `radius`: Bán kính (mét)
- `strokeWidth`: Độ dày viền
- `strokeColor`: Màu viền
- `fillColor`: Màu fill

---

### 4. **Polygon** (Đa giác)

```tsx
import { Polygon } from 'react-native-maps';

<Polygon
  coordinates={[
    { latitude: 10.76, longitude: 106.66 },
    { latitude: 10.77, longitude: 106.67 },
    { latitude: 10.75, longitude: 106.68 },
  ]}
  strokeWidth={2}
  strokeColor="#FF0000"
  fillColor="rgba(255, 0, 0, 0.3)"
/>
```

---

### 5. **Polyline** (Đường thẳng nối các điểm)

```tsx
import { Polyline } from 'react-native-maps';

<Polyline
  coordinates={[
    { latitude: 10.76, longitude: 106.66 },
    { latitude: 10.77, longitude: 106.67 },
    { latitude: 10.78, longitude: 106.68 },
  ]}
  strokeWidth={3}
  strokeColor="#0000FF"
  lineDashPattern={[1, 5]} // Đường đứt đoạn
/>
```

---

### 6. **Callout** (Popup khi click marker)

```tsx
<Marker coordinate={...}>
  <Callout onPress={() => console.log('Callout pressed')}>
    <View style={styles.callout}>
      <Text style={styles.title}>Location Name</Text>
      <Text>Address here</Text>
      <Image source={{uri: 'https://...'}} />
    </View>
  </Callout>
</Marker>
```

---

## 🎮 MapView Methods (Ref)

```tsx
const mapRef = useRef<MapView>(null);

// Animate đến vị trí
mapRef.current?.animateToRegion({
  latitude: 10.762622,
  longitude: 106.660172,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}, 1000); // duration: 1000ms

// Fit tất cả markers vào viewport
mapRef.current?.fitToCoordinates(
  [
    { latitude: 10.76, longitude: 106.66 },
    { latitude: 10.77, longitude: 106.67 },
  ],
  {
    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    animated: true,
  }
);

// Lấy region hiện tại
const region = await mapRef.current?.getCamera();
```

**Methods quan trọng:**
- `animateToRegion(region, duration)`: Animate đến vị trí
- `animateCamera(camera, duration)`: Animate camera
- `fitToCoordinates(coordinates, options)`: Fit markers
- `fitToElements(animated)`: Auto fit tất cả elements
- `getCamera()`: Lấy thông tin camera hiện tại

---

## 📍 Working with User Location

### 1. Request Permission

```tsx
import * as Location from 'expo-location';

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    console.log('Permission denied');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
};
```

### 2. Show User Location on Map

```tsx
<MapView
  showsUserLocation={true}
  followsUserLocation={true}
  showsMyLocationButton={true}
/>
```

---

## 🎨 Custom Styling

### Map Type

```tsx
<MapView
  mapType="standard"  // 'standard' | 'satellite' | 'hybrid' | 'terrain'
/>
```

### Custom Map Style (Google Maps only)

```tsx
import mapStyle from './mapStyle.json';

<MapView
  provider={PROVIDER_GOOGLE}
  customMapStyle={mapStyle}
/>
```

**mapStyle.json** (Tạo tại [Google Maps Styling Wizard](https://mapstyle.withgoogle.com/)):
```json
[
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#00ffff" }]
  }
]
```

---

## ⚡ Performance Tips

### 1. Use `tracksViewChanges={false}`
```tsx
<Marker 
  coordinate={...}
  tracksViewChanges={false} // ⭐ Quan trọng nhất
/>
```

### 2. Render only visible markers
```tsx
const [visibleMarkers, setVisibleMarkers] = useState([]);

const handleRegionChange = (region) => {
  const filtered = allMarkers.filter(marker => 
    isInViewport(marker, region)
  );
  setVisibleMarkers(filtered);
};
```

### 3. Use React.memo
```tsx
const MarkerItem = React.memo(({ data }) => (
  <Marker coordinate={data.coordinate} tracksViewChanges={false} />
));
```

---

## 🔧 Common Patterns

### Pattern 1: Animated User Location

```tsx
const [region, setRegion] = useState(initialRegion);

useEffect(() => {
  const subscription = Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High },
    (location) => {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  );
  
  return () => subscription.then(sub => sub.remove());
}, []);

<MapView region={region} />
```

### Pattern 2: Cluster Markers (when zoomed out)

```tsx
const [zoom, setZoom] = useState(0);

const handleRegionChange = (region) => {
  setZoom(region.latitudeDelta);
};

const shouldCluster = zoom > 0.5;

{shouldCluster ? (
  <Marker coordinate={clusterCenter} />
) : (
  markers.map(m => <Marker key={m.id} coordinate={m.coordinate} />)
)}
```

### Pattern 3: Directions/Routes

```tsx
import { Polyline } from 'react-native-maps';

const routeCoordinates = [
  { latitude: 10.76, longitude: 106.66 },
  { latitude: 10.77, longitude: 106.67 },
  // ... more points
];

<Polyline
  coordinates={routeCoordinates}
  strokeWidth={4}
  strokeColor="#007AFF"
/>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Map không hiển thị (blank)

**Nguyên nhân:** Chưa có API key hoặc sai config

**Fix:**
```json
// app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY"
      }
    }
  }
}
```

### Issue 2: Markers bị lag khi zoom/pan

**Fix:**
```tsx
<Marker tracksViewChanges={false} /> // ← Thêm dòng này
```

### Issue 3: Map bị crash khi có quá nhiều markers

**Fix:** Implement viewport filtering (chỉ render markers nhìn thấy)

---

## 📚 Resources

- [Official Docs](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Google Maps API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Map Styling Wizard](https://mapstyle.withgoogle.com/)

---

**Happy Mapping! 🗺️✨**

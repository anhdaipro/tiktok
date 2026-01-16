# CarouselSlider Component

Component carousel tái sử dụng với infinite scroll, auto-play và gesture handling được tối ưu hóa cho React Native.

## ✨ Features

- ✅ **Infinite Scroll** - Cuộn vô hạn không giới hạn
- ✅ **Auto-play** - Tự động chuyển slide với interval tùy chỉnh
- ✅ **Gesture Handling** - Swipe mượt mà, tương thích với ScrollView cha
- ✅ **Animated Dots** - Chỉ báo dot với animation mượt
- ✅ **Custom Render** - Hỗ trợ render item tùy chỉnh
- ✅ **Fully Typed** - TypeScript support đầy đủ
- ✅ **Performance** - Tối ưu hóa với React.memo và worklet

## 📦 Installation

Component này đã có sẵn trong project. Import từ:

```tsx
import { CarouselSlider } from '@/components/common/carousel-slider';
```

## 🚀 Usage

### Basic Example

```tsx
import { CarouselSlider } from '@/components/common/carousel-slider';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const banners = [
  { id: '1', image: 'https://example.com/banner1.jpg' },
  { id: '2', image: 'https://example.com/banner2.jpg' },
  { id: '3', image: 'https://example.com/banner3.jpg' },
];

export const MyBanner = () => (
  <CarouselSlider
    data={banners}
    width={width - 24}
    height={140}
    autoScrollInterval={3000}
  />
);
```

### Custom Render Item

```tsx
import { CarouselSlider, CarouselItem } from '@/components/common/carousel-slider';

interface Product extends CarouselItem {
  title: string;
  price: number;
}

const products: Product[] = [
  { id: '1', title: 'Product 1', price: 100, image: '...' },
  { id: '2', title: 'Product 2', price: 200, image: '...' },
];

export const ProductCarousel = () => (
  <CarouselSlider
    data={products}
    width={300}
    height={400}
    renderItem={(item: Product) => (
      <View>
        <Image source={{ uri: item.image }} />
        <Text>{item.title}</Text>
        <Text>${item.price}</Text>
      </View>
    )}
  />
);
```

### Disable Auto-scroll

```tsx
<CarouselSlider
  data={items}
  width={350}
  height={200}
  autoScrollInterval={0} // Set to 0 to disable
/>
```

### Custom Styling

```tsx
<CarouselSlider
  data={items}
  width={350}
  height={200}
  borderRadius={20}
  paddingVertical={16}
  containerStyle={{ backgroundColor: '#f5f5f5' }}
  itemStyle={{ shadowColor: '#000', shadowOpacity: 0.1 }}
  imageStyle={{ resizeMode: 'cover' }}
  dotColor="#FF0000"
/>
```

### Hide Dots

```tsx
<CarouselSlider
  data={items}
  width={350}
  height={200}
  showDots={false}
/>
```

## 📝 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CarouselItem[]` | **Required** | Array of items to display |
| `width` | `number` | **Required** | Width of each carousel item |
| `height` | `number` | **Required** | Height of each carousel item |
| `autoScrollInterval` | `number` | `3000` | Auto scroll interval in ms (0 to disable) |
| `borderRadius` | `number` | `12` | Border radius for items |
| `showDots` | `boolean` | `true` | Show dot indicators |
| `paddingVertical` | `number` | `12` | Vertical padding |
| `renderItem` | `(item, index) => ReactNode` | `undefined` | Custom render function |
| `containerStyle` | `ViewStyle` | `undefined` | Container style |
| `itemStyle` | `ViewStyle` | `undefined` | Item container style |
| `imageStyle` | `ImageStyle` | `undefined` | Image style (default render only) |
| `dotColor` | `string` | `colors.text` | Dot color |
| `activeDotOpacity` | `number` | `1` | Active dot opacity |
| `inactiveDotOpacity` | `number` | `0.3` | Inactive dot opacity |

## 🎯 CarouselItem Interface

```typescript
interface CarouselItem {
  id: string;           // Required unique identifier
  image?: string;       // Optional image URL (used in default render)
  [key: string]: any;   // Any additional custom properties
}
```

## 🔧 Advanced Features

### Gesture Handling

Component tự động xử lý conflict với ScrollView cha:
- `activeOffsetX([-10, 10])` - Chỉ kích hoạt khi swipe ngang ≥ 10px
- `failOffsetY([-10, 10])` - Hủy gesture nếu swipe dọc ≥ 10px

### Performance Optimization

- Sử dụng `React.memo` để tránh re-render không cần thiết
- Worklet functions cho animation mượt mà
- `useSharedValue` cho state trong UI thread

### Infinite Scroll Logic

Component tự động thêm clone của item đầu/cuối để tạo hiệu ứng infinite scroll:
```
[last, ...items, first]
```

## 📱 Use Cases

1. **Banner Slider** - Hiển thị promotional banners
2. **Product Carousel** - Showcase sản phẩm
3. **Image Gallery** - Gallery ảnh với swipe
4. **Testimonials** - Customer reviews carousel
5. **Feature Highlights** - App features showcase

## 🐛 Troubleshooting

### Carousel không hoạt động trong ScrollView

Component đã được tối ưu để hoạt động trong ScrollView. Đảm bảo:
- Sử dụng `MasonryFlashList` hoặc `FlatList` cho parent
- Không wrap trong nhiều lớp ScrollView

### Auto-scroll không dừng khi swipe

Đây là behavior mong muốn. Auto-scroll sẽ:
1. Dừng khi user bắt đầu swipe
2. Reset lại sau khi swipe kết thúc

## 📄 License

MIT - Free to use in your project

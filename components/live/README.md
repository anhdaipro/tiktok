# Live Shopping Screen Components

Component architecture for the Live Shopping feature, following a modular and reusable design pattern.

## Components Overview

### 1. FollowingChannelItem
**Location:** `components/live/following-channel-item.tsx`

Displays a shop channel avatar with live status indicator.

**Props:**
```typescript
interface FollowingChannelItemProps {
    avatar: string;         // Shop avatar URL
    shopName: string;       // Shop display name
    isLive: boolean;        // Live status
    onPress?: () => void;   // Tap handler
}
```

**Features:**
- Circular avatar (80x80px) with pink border when live
- Live badge with mic icon (bottom-right corner)
- Shop name label below avatar
- Touchable with opacity feedback

---

### 2. LiveVoucherBanner
**Location:** `components/live/live-voucher-banner.tsx`

Promotional banner for voucher campaigns with gradient background.

**Props:**
```typescript
interface LiveVoucherBannerProps {
    voucherValue: string;   // Display value (e.g., "4,597Tr đ")
    onPress?: () => void;   // Tap handler
}
```

**Features:**
- Horizontal gradient (#FF4081 → #E91E63)
- Gift icon on left
- Dynamic value text
- "Nhận" (Claim) button on right
- Shadow effect for depth

---

### 3. LiveStreamCard  
**Location:** `components/live/live-stream-card.tsx`

Individual live stream card with video preview and product info.

**Props:**
```typescript
interface LiveStreamCardProps {
    id: string;
    thumbnail: string;      // Live stream thumbnail
    viewerCount: number;    // Current viewers
    shopAvatar: string;     // Shop avatar
    shopName: string;       // Shop name
    productImage: string;   // Featured product image
    productName: string;    // Product name
    productPrice: number;   // Product price
    onPress?: () => void;
}
```

**Features:**
- 3:4 aspect ratio video preview
- Live badge with viewer count (top-left)
- Shop info overlay on video (bottom)
- Product card below (image + name + price)
- Auto-formats viewer count (1.3k, 337, etc.)
- Price in Vietnamese format with red color

**Layout:**
```
┌─────────────────┐
│ [LIVE] 1.3k    │ ← Live badge
│                 │
│   Thumbnail     │
│                 │
│ [shop] Name    │ ← Shop overlay
└─────────────────┘
┌───┐ Product Name
│   │ 11.800.000đ
└───┘
```

---

### 4. LiveStreamGrid
**Location:** `components/live/live-stream-grid.tsx`

Grid container for displaying multiple live streams.

**Props:**
```typescript
interface LiveStreamGridProps {
    streams: LiveStreamData[];
    onStreamPress?: (id: string) => void;
}
```

**Features:**
- Uses FlashList for performance
- 2-column grid layout
- 12px gap between items
- Vertical scrolling
- Optimized rendering

---

## Main Screen

**Location:** `app/live.tsx`

### Structure:
```
<SafeAreaView>
  <Header title="Mua sắm qua LIVE" />
  
  <ScrollView>
    {/* Following Channels - Horizontal */}
    <ScrollView horizontal>
      <FollowingChannelItem />
      <FollowingChannelItem />
      ...
    </ScrollView>
    
    {/* Voucher Banner */}
    <LiveVoucherBanner />
    
    {/* Live Streams - 2 Column Grid */}
    <LiveStreamGrid />
  </ScrollView>
</SafeAreaView>
```

### Mock Data:
- 3 following channels
- 6 live streams with products

---

## Data Types

```typescript
interface FollowingChannel {
    id: string;
    avatar: string;
    shopName: string;
    isLive: boolean;
}

interface LiveStreamData {
    id: string;
    thumbnail: string;
    viewerCount: number;
    shopAvatar: string;
    shopName: string;
    productImage: string;
    productName: string;
    productPrice: number;
}
```

---

## Usage Example

```tsx
import { 
    FollowingChannelItem,
    LiveVoucherBanner, 
    LiveStreamGrid,
    LiveStreamData 
} from '@/components/live';

// In your component
<FollowingChannelItem
    avatar="https://..."
    shopName="Jelly Jello"
    isLive={true}
/>

<LiveVoucherBanner voucherValue="4,597Tr đ" />

<LiveStreamGrid
    streams={liveStreams}
    onStreamPress={(id) => console.log(id)}
/>
```

---

## Styling

### Theme Integration:
All components use `useTheme()` for:
- Background colors
- Text colors
- Surface colors

### Color Palette:
- Live indicator: `#FF2D55`
- Price color: `#FF2D55`
- Voucher gradient: `#FF4081` → `#E91E63`

### Layout:
- Container padding: 16px
- Grid gap: 12px
- Card border radius: 12px
- Avatar size: 80x80px

---

## Navigation

Added to quick links in `components/shop/quick-links.tsx`:
```tsx
{ 
    id: 'live', 
    icon: Video, 
    label: 'LIVE', 
    color: '#FF2D55' 
}
```

Screen registered in `app/_layout.tsx`:
```tsx
<Stack.Screen name="live" options={{ headerShown: false }} />
```

---

## Performance Optimizations

1. **FlashList** for grid rendering
2. **Image caching** via uri
3. **Memoized styles** where applicable
4. **Optimized re-renders** with proper key props

---

## Future Enhancements

- [ ] Pull-to-refresh for live streams
- [ ] Real-time viewer count updates
- [ ] Live stream filtering by category
- [ ] Search functionality
- [ ] Infinite scroll for streams
- [ ] Skeleton loading states

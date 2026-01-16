# Voucher Components

Bộ components cho màn hình Voucher Center với thiết kế đẹp mắt, sử dụng SVG để tạo hiệu ứng đục lỗ tròn 2 bên và gradient.

## 📦 Components

### 1. VoucherCard
Component voucher chính với SVG cutouts và gradient support.

**Props:**
- `title` - Tiêu đề voucher (vd: "Giảm 20%")
- `description` - Mô tả (vd: "cho đơn trên 79K đ")
- `validUntil` - Thời hạn sử dụng
- `tag` - Tag nhỏ (vd: "Quy đổi giờ hạn")
- `source` - Nguồn voucher (vd: "Từ TikTok Shop")
- `variant` - `'default'` hoặc `'gradient'`
- `onPress` - Callback khi nhấn

**Features:**
- ✅ SVG cutouts (lỗ tròn 2 bên)
- ✅ Gradient background support
- ✅ Dotted line separator
- ✅ Nút "Nhận" với shadow

### 2. VoucherXtraCard
Component voucher nhỏ hơn cho section Voucher Xtra với gradient đặc biệt.

**Props:**
- `title` - Tiêu đề
- `description` - Mô tả
- `tag` - Tag
- `source` - Nguồn
- `onPress` - Callback

**Features:**
- ✅ Gradient background (5A0F1F → 8B1538 → A01D3A)
- ✅ SVG cutouts
- ✅ Kích thước nhỏ gọn (300x100)

### 3. VoucherXtraSection
Header section cho Voucher Xtra với gradient background.

**Props:**
- `onPressReceiveAll` - Callback cho nút "Nhận hết"

**Features:**
- ✅ Gradient background
- ✅ Nút "Nhận hết"
- ✅ Title và subtitle

### 4. MyVoucherHeader
Header hiển thị số lượng voucher của user.

**Props:**
- `count` - Số lượng voucher
- `onPress` - Callback khi nhấn

**Features:**
- ✅ Icon voucher (Ticket)
- ✅ Hiển thị số lượng
- ✅ Chevron right

### 5. ProductVoucherCard
Card hiển thị sản phẩm kèm voucher.

**Props:**
- `productImage` - URL ảnh sản phẩm
- `productName` - Tên sản phẩm
- `discount` - Mức giảm giá
- `originalPrice` - Giá gốc (optional)
- `unavailable` - Trạng thái hết hàng
- `onPress` - Callback

**Features:**
- ✅ Hiển thị ảnh sản phẩm
- ✅ Badge giảm giá
- ✅ Overlay "Hết hàng"
- ✅ Giá gốc gạch ngang

## 🎨 Design Features

### SVG Cutouts
Sử dụng SVG mask để tạo hiệu ứng đục lỗ tròn 2 bên:

```tsx
<mask id="voucherMask">
    <Rect x="0" y="0" width="400" height="140" fill="white" />
    <Circle cx="0" cy="70" r="12" fill="black" />
    <Circle cx="400" cy="70" r="12" fill="black" />
</mask>
```

### Gradient Colors
**Voucher Xtra Gradient:**
- Start: `#5A0F1F`
- Middle: `#8B1538`
- End: `#A01D3A`

**Section Header Gradient:**
- Start: `#C41E3A`
- End: `#8B1538`

**Default Voucher:**
- Background: `#2A2A2A`

## 📱 Usage Example

```tsx
import { VoucherCard } from '@/components/voucher/voucher-card';

<VoucherCard
    tag="Quy đổi giờ hạn"
    source="Từ TikTok Shop"
    title="Giảm 20%"
    description="cho đơn trên 79K đ"
    validUntil="Áp dụng trong 1 ngày từ khi lấy mã"
    variant="default"
/>
```

## 🎯 Screen Structure

```
VoucherScreen
├── Header (Back, Title, Cart)
├── MyVoucherHeader
├── VoucherXtraSection
├── VoucherXtraCard (Horizontal Scroll)
├── Exclusive Vouchers Section
│   └── VoucherCard (List)
└── Product Vouchers Section
    └── ProductVoucherCard (Horizontal Scroll)
```

## 🎨 Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary Red | `#FF2D55` | Buttons, badges |
| Dark Red | `#8B1538` | Gradient |
| Medium Red | `#C41E3A` | Gradient |
| Dark Gray | `#2A2A2A` | Voucher background |
| White | `#FFFFFF` | Text on dark bg |

## 📐 Dimensions

| Component | Width | Height |
|-----------|-------|--------|
| VoucherCard | 100% | 140px |
| VoucherXtraCard | 300px | 100px |
| ProductVoucherCard | 160px | ~240px |
| Circle Cutout | - | 12px radius |

## 🚀 Performance Tips

1. **Memoization**: Tất cả components đã được optimize
2. **SVG**: Sử dụng `preserveAspectRatio="none"` để scale
3. **Images**: Dùng `resizeMode="cover"` cho product images
4. **Lists**: Sử dụng `key` prop cho performance

## 🎭 Theme Support

Tất cả components đều hỗ trợ dark/light theme thông qua `useTheme()` hook.

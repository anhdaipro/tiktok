# 🔐 Biometric Authentication - Hướng dẫn sử dụng

## 📦 Cài đặt

Package `expo-local-authentication` đã được cài đặt tự động với phiên bản tương thích SDK 53.

## 🎯 Các file đã tạo

### 1. Hook: `hooks/useBiometric.ts`
Hook chính để quản lý xác thực sinh trắc học.

### 2. Demo Screen: `app/biometric-demo.tsx`
Màn hình demo đầy đủ tính năng để test.

### 3. Components: `components/biometric/index.tsx`
Các component tái sử dụng:
- `BiometricButton` - Nút xác thực
- `BiometricLock` - Wrapper khóa nội dung

---

## 🚀 Cách sử dụng

### 1️⃣ Sử dụng Hook cơ bản

```tsx
import { useBiometric } from '@/hooks/useBiometric';

function MyComponent() {
  const { capabilities, authenticate, getBiometricName } = useBiometric();

  const handleAuth = async () => {
    const result = await authenticate({
      promptMessage: 'Xác thực để tiếp tục',
    });

    if (result.success) {
      console.log('✅ Xác thực thành công!');
    } else {
      console.log('❌ Lỗi:', result.error);
    }
  };

  return (
    <Button 
      onPress={handleAuth}
      disabled={!capabilities.isEnrolled}
    >
      Xác thực {getBiometricName()}
    </Button>
  );
}
```

### 2️⃣ Sử dụng BiometricButton

```tsx
import { BiometricButton } from '@/components/biometric';

function PaymentScreen() {
  const handlePayment = () => {
    // Xử lý thanh toán sau khi xác thực thành công
    console.log('Đang xử lý thanh toán...');
  };

  return (
    <BiometricButton
      onSuccess={handlePayment}
      onError={(error) => alert(error)}
      promptMessage="Xác thực để thanh toán"
      buttonText="Thanh toán an toàn"
      variant="primary"
    />
  );
}
```

### 3️⃣ Sử dụng BiometricLock

```tsx
import { BiometricLock } from '@/components/biometric';

function PrivateContent() {
  return (
    <BiometricLock
      lockMessage="Thông tin tài khoản ngân hàng"
      promptMessage="Xác thực để xem số tài khoản"
      onUnlock={() => console.log('Đã mở khóa')}
    >
      {/* Nội dung nhạy cảm */}
      <Text>Số tài khoản: 1234567890</Text>
      <Text>Số dư: 10,000,000 VNĐ</Text>
    </BiometricLock>
  );
}
```

---

## 🎨 Các ví dụ thực tế

### 1. Xác thực trước khi thanh toán

```tsx
import { useBiometric } from '@/hooks/useBiometric';
import { Alert } from 'react-native';

const handleCheckout = async () => {
  const { authenticate } = useBiometric();
  
  const result = await authenticate({
    promptMessage: 'Xác nhận thanh toán 500,000 VNĐ',
    cancelLabel: 'Hủy',
  });

  if (result.success) {
    processPayment();
  } else {
    Alert.alert('Lỗi', 'Vui lòng xác thực để tiếp tục');
  }
};
```

### 2. Bảo vệ cài đặt nhạy cảm

```tsx
function SettingsScreen() {
  return (
    <BiometricLock lockMessage="Cài đặt bảo mật">
      <SecuritySettings />
    </BiometricLock>
  );
}
```

### 3. Xác thực khi xem lịch sử đơn hàng

```tsx
function OrderHistory() {
  const [showOrders, setShowOrders] = useState(false);
  
  return (
    <>
      {!showOrders ? (
        <BiometricButton
          onSuccess={() => setShowOrders(true)}
          buttonText="Xem lịch sử đơn hàng"
          variant="outline"
        />
      ) : (
        <OrderList />
      )}
    </>
  );
}
```

### 4. Kiểm tra khả năng trước khi hiển thị tùy chọn

```tsx
function ProfileScreen() {
  const { capabilities } = useBiometric();

  return (
    <View>
      {capabilities.isEnrolled && (
        <TouchableOpacity onPress={enableBiometricLogin}>
          <Text>Bật đăng nhập bằng {getBiometricName()}</Text>
        </TouchableOpacity>
      )}
      
      {!capabilities.isEnrolled && capabilities.isAvailable && (
        <Text style={styles.warning}>
          Bật sinh trắc học trong Cài đặt để sử dụng tính năng này
        </Text>
      )}
    </View>
  );
}
```

---

## ⚙️ Cấu hình iOS

Thêm vào `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Cho phép ứng dụng sử dụng Face ID để xác thực an toàn"
      }
    }
  }
}
```

---

## 🤖 Cấu hình Android

**Không cần cấu hình thêm!** Expo tự động xử lý permissions cho Android.

> **Lưu ý**: Android cần API Level 23+ (Android 6.0+)

---

## 📋 API Reference

### `useBiometric()` Hook

```typescript
interface BiometricCapabilities {
  isAvailable: boolean;        // Thiết bị có hỗ trợ không
  isEnrolled: boolean;          // Đã đăng ký sinh trắc chưa
  supportedTypes: AuthenticationType[];
  biometricType: 'face' | 'fingerprint' | 'iris' | 'none';
}

interface BiometricResult {
  success: boolean;
  error?: string;
  warning?: string;
}

// Return values
{
  capabilities: BiometricCapabilities;
  isChecking: boolean;
  authenticate: (options?) => Promise<BiometricResult>;
  getBiometricName: () => string;
  getSecurityLevel: () => Promise<{level: string; description: string}>;
  refreshCapabilities: () => Promise<void>;
}
```

### `authenticate()` Options

```typescript
{
  promptMessage?: string;          // Thông báo hiển thị
  cancelLabel?: string;            // Label nút hủy
  fallbackLabel?: string;          // Label dùng mật khẩu (iOS)
  disableDeviceFallback?: boolean; // Tắt fallback sang PIN
}
```

### `BiometricButton` Props

```typescript
{
  onSuccess: () => void;           // Callback khi thành công
  onError?: (error: string) => void;
  promptMessage?: string;
  buttonText?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}
```

### `BiometricLock` Props

```typescript
{
  children: React.ReactNode;
  onUnlock?: () => void;
  promptMessage?: string;
  lockMessage?: string;
}
```

---

## 🧪 Test trên thiết bị thật

Để test đầy đủ, bạn cần:

1. **Build development app**:
   ```bash
   npx expo run:ios
   # hoặc
   npx expo run:android
   ```

2. **Thiết lập sinh trắc học trên thiết bị**:
   - iOS: Settings → Face ID & Passcode / Touch ID & Passcode
   - Android: Settings → Security → Fingerprint / Face unlock

3. **Mở màn hình demo**:
   - Truy cập route: `/biometric-demo`

---

## 🎯 Use Cases phổ biến

✅ Xác thực thanh toán  
✅ Đăng nhập nhanh  
✅ Bảo vệ thông tin nhạy cảm  
✅ Xác nhận giao dịch  
✅ Mở khóa cài đặt bảo mật  
✅ Truy cập ví điện tử  

---

## 🔒 Best Practices

1. **Luôn kiểm tra `isEnrolled`** trước khi yêu cầu xác thực
2. **Cung cấp phương án dự phòng** (PIN/Password) nếu sinh trắc thất bại
3. **Thông báo rõ ràng** tại sao cần xác thực
4. **Xử lý lỗi gracefully** - đừng block người dùng hoàn toàn
5. **Test trên thiết bị thật** - simulator có thể không chính xác 100%

---

## ❓ Troubleshooting

### ❌ "Sinh trắc học không khả dụng"
**Giải pháp**: Kiểm tra thiết bị đã đăng ký vân tay/Face ID chưa

### ❌ Build lỗi trên iOS
**Giải pháp**: Thêm `NSFaceIDUsageDescription` vào `app.json`

### ❌ Không hoạt động trên Simulator
**Nguyên nhân**: Simulator không hỗ trợ sinh trắc học đầy đủ  
**Giải pháp**: Test trên thiết bị thật

### ❌ Android crash khi xác thực
**Giải pháp**: Đảm bảo API Level >= 23

---

## 🎉 Hoàn thành!

Bây giờ bạn đã có hệ thống xác thực sinh trắc học hoàn chỉnh!

**Các bước tiếp theo**:
1. ✅ Test trên `/biometric-demo`
2. ✅ Tích hợp vào các màn hình cần bảo mật
3. ✅ Tùy chỉnh UI theo design của bạn

---

**Support**: Hỏi tôi bất cứ lúc nào! 🚀

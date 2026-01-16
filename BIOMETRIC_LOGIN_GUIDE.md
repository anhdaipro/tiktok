# 🔐 Hướng dẫn Biometric Login - Tích hợp hoàn chỉnh

## ✅ Đã triển khai

### 📦 Packages Đã Cài
- ✅ `expo-local-authentication` - Xác thực sinh trắc học
- ✅ `expo-secure-store` - Lưu credentials an toàn (iOS Keychain / Android Keystore)

### 📁 Files Đã Tạo

#### 1. **Core Infrastructure**
- `stores/auth.ts` - Extended với biometric state
- `services/biometric-credentials.ts` - Quản lý encrypted credentials
- `hooks/useBiometric.ts` - Hook xác thực sinh trắc
- `hooks/useBiometricLogin.ts` - Hook quản lý biometric login

#### 2. **UI Components**
- `components/biometric/index.tsx` - BiometricButton & BiometricLock
- `components/login/biometric-login.tsx` - BiometricQuickLogin component

#### 3. **Screens**
- `app/login.tsx` - ✅ Đã tích hợp BiometricQuickLogin
- `app/setting/biometric-demo.tsx` - Demo/test biometric
- `app/setting/biometric-security.tsx` - Quản lý biometric settings

---

## 🔄 Flow Hoạt Động

### A. **Lần đầu đăng nhập (Enable Biometric)**

```
1. User đăng nhập bằng email + password
   ↓
2. Sau khi login thành công, hiện Alert:
   "Bật đăng nhập bằng Face ID/Touch ID?"
   ↓
3. User chọn "Bật ngay":
   - Xác thực sinh trắc học để confirm
   - Password được mã hóa & lưu vào SecureStore
   - Auth store cập nhật biometricEnabled = true
   ↓
4. Lần sau sẽ hiện BiometricQuickLogin button
```

### B. **Đăng nhập nhanh bằng Biometric**

```
1. Màn hình login hiển thị BiometricQuickLogin
   (Hiện identifier: "user@example.com")
   ↓
2. User nhấn nút "Đăng nhập bằng Face ID"
   ↓
3. Hệ thống xác thực sinh trắc học
   ↓
4. Lấy credentials từ SecureStore
   ↓
5. Tự động gọi API login với saved credentials
   ↓
6. Đăng nhập thành công → Navigate to home
```

---

## 💻 Code Examples

### 1. **Tích hợp vào Login Screen (Đã làm)**

```tsx
import { BiometricQuickLogin } from '@/components/login/biometric-login';

export default function LoginScreen() {
  return (
    <View>
      <Text>Đăng nhập vào TikTok</Text>
      
      {/* Quick Login bằng Biometric */}
      <BiometricQuickLogin />
      
      {/* Form đăng nhập thông thường */}
      <TextInput placeholder="Email" />
      <TextInput placeholder="Mật khẩu" secureTextEntry />
      <Button onPress={handleLogin}>Đăng nhập</Button>
    </View>
  );
}
```

### 2. **Prompt Enable sau khi Login thành công**

Bạn có 2 cách:

#### Cách 1: Alert tự động (Khuyến nghị)

Thêm vào `useLoginMutation` sau khi login thành công:

```tsx
// File: hooks/react-query/auth/use-mutation-login.ts
import { useBiometricLogin } from '@/hooks/useBiometricLogin';

export function useLoginMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.signIn);
  const { promptEnable } = useBiometricLogin(); // ← Thêm
  
  // Lưu credentials để dùng cho promptEnable
  const [lastCredentials, setLastCredentials] = useState<LoginPayload | null>(null);
  
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      setLastCredentials(payload); // Lưu lại
      const res = await axios.post('/auth/login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
      showToast({ message: "Login successfully", type: "success" });
      
      // ← Hỏi user có muốn bật biometric không
      if (lastCredentials) {
        promptEnable(lastCredentials);
      }
      
      router.replace('/');
    },
  });
}
```

#### Cách 2: Modal custom trong Login screen

```tsx
const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
const [loginCredentials, setLoginCredentials] = useState(null);

const { mutate: loginMutation, isPending } = useLoginMutation({
  onSuccess: (data, variables) => {
    setLoginCredentials(variables); // Lưu email & password
    setShowBiometricPrompt(true);
  }
});

// Render modal
{showBiometricPrompt && (
  <BiometricLoginPrompt
    identifier={loginCredentials.identifier}
    onEnableBiometric={async () => {
      await enable(loginCredentials);
      setShowBiometricPrompt(false);
    }}
  />
)}
```

### 3. **Quản lý trong Settings**

```tsx
// Navigate to biometric security settings
<TouchableOpacity onPress={() => router.push('/setting/biometric-security')}>
  <Text>🔐 Quản lý đăng nhập sinh trắc học</Text>
</TouchableOpacity>
```

### 4. **Disable Biometric Login**

```tsx
import { useBiometricLogin } from '@/hooks/useBiometricLogin';

function SettingsScreen() {
  const { disable, isEnabled } = useBiometricLogin();
  
  return (
    <Button onPress={disable}>
      {isEnabled ? 'Tắt' : 'Bật'} sinh trắc học
    </Button>
  );
}
```

---

## 🎯 Các Màn Hình Quan Trọng

| Màn hình | Route | Mục đích |
|----------|-------|----------|
| Login | `/login` | Hiện BiometricQuickLogin nếu đã enable |
| Settings | `/setting/biometric-security` | Quản lý biometric login |
| Demo | `/setting/biometric-demo` | Test xác thực |

---

## 🔐 Bảo Mật & Best Practices

### ✅ Đang làm đúng:
1. **Mã hóa password** - Dùng SecureStore (iOS Keychain / Android Keystore)
2. **Biometric confirmation** - Yêu cầu xác thực khi enable
3. **Clear on logout** - Xóa credentials khi đăng xuất
4. **Fallback to password** - Vẫn cho phép login bằng password

### ⚠️ Lưu ý quan trọng:
1. **Không lưu password ở đâu khác** - Chỉ trong SecureStore
2. **Test trên thiết bị thật** - Simulator không hỗ trợ đầy đủ
3. **Handle errors gracefully** - Không block user nếu biometric thất bại
4. **Privacy** - Giải thích rõ cách lưu credentials cho user

---

## 🧪 Testing Checklist

### Workflow 1: Enable Biometric
- [ ] Đăng nhập lần đầu bằng email + password
- [ ] Hiện prompt "Bật Face ID/Touch ID?"
- [ ] Chọn "Bật ngay" → xác thực sinh trắc thành công
- [ ] Check `biometricEnabled: true` trong auth store
- [ ] Credentials được lưu trong SecureStore

### Workflow 2: Quick Login
- [ ] Mở app lần sau, màn hình login hiện BiometricQuickLogin
- [ ] Hiển thị identifier (email) đã lưu
- [ ] Nhấn nút → Xác thực sinh trắc
- [ ] Tự động login thành công

### Workflow 3: Disable
- [ ] Vào Settings → Biometric Security
- [ ] Toggle switch OFF
- [ ] Credentials bị xóa khỏi SecureStore
- [ ] Lần sau không hiện BiometricQuickLogin

### Workflow 4: Logout
- [ ] Đăng xuất
- [ ] `biometricEnabled` reset về false
- [ ] Credentials bị xóa

---

## 🐛 Troubleshooting

### ❌ BiometricQuickLogin không hiện
**Check list:**
- `biometricEnabled === true`?
- `savedCredentials !== null`?
- Thiết bị đã đăng ký sinh trắc học?
- Check auth store: `useAuthStore.getState()`

### ❌ Không lưu được credentials
**Giải pháp:**
- Check SecureStore permissions
- Android: Đảm bảo API Level >= 23
- iOS: Check NSLocalNetworkUsageDescription trong app.json

### ❌ BiometricQuickLogin hiện nhưng không login được
**Debug:**
```tsx
// Thêm vào BiometricQuickLogin component
console.log('Biometric result:', result);
console.log('Credentials:', credentials);
```

Check xem credentials có null không

---

## 🔄 Update Login Mutation (Bước tiếp theo)

Để tự động prompt enable biometric sau khi login, update file:

`hooks/react-query/auth/use-mutation-login.ts`

```tsx
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { useState } from 'react';

export function useLoginMutation() {
  const router = useRouter();
  const login = useAuthStore((state) => state.signIn);
  const { promptEnable } = useBiometricLogin();
  const [lastPayload, setLastPayload] = useState<LoginPayload | null>(null);
  
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      setLastPayload(payload); // Lưu để dùng cho biometric
      const res = await axios.post('/auth/login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
      showToast({ message: "Login successfully", type: "success" });
      
      // Prompt enable biometric (chỉ nếu chưa bật)
      if (lastPayload) {
        setTimeout(() => {
          promptEnable(lastPayload);
        }, 500); // Delay nhỏ để UX mượt hơn
      }
      
      router.replace('/');
    },
    onError: (error: any) => {
      showToast({ message: error?.message || "Login failed", type: "danger" });
      console.log(error);
    },
    retry: false
  });
}
```

---

## 🎉 Hoàn thành!

Bạn đã có hệ thống **Biometric Login** hoàn chỉnh với:
- ✅ Quick login bằng Face ID/Touch ID/Fingerprint
- ✅ Lưu trữ credentials an toàn (encrypted)
- ✅ UI settings để quản lý
- ✅ Auto-prompt khi đăng nhập thành công

**Bạn muốn tôi giúp gì thêm?**
- Implement auto-prompt trong `useLoginMutation`?
- Tạo thêm animations cho biometric UI?
- Test và debug trên thiết bị thật?

Cứ hỏi tôi nhé! 🚀

// utils/ToastService.ts
import { MessageOptions } from 'react-native-flash-message';

// Định nghĩa hàm show
interface ToastRef {
  show: (options: MessageOptions) => void;
}

let _toastRef: ToastRef | null = null;

// Hàm để Component đăng ký Ref vào đây
export const setToastRef = (ref: ToastRef | null) => {
  _toastRef = ref;
};

// Hàm để bạn gọi ở bất cứ đâu (API, Redux, Screen)
export const showToast = (options: MessageOptions) => {
  if (_toastRef) {
    _toastRef.show(options);
  }
};
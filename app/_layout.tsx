
import FlashMessageModal from '@/components/flash-message-modal';
import { ModalLoading } from '@/components/modal-loading';
import { AlertProvider } from '@/contexts/alert-context';
import { BottomSheetProvider } from '@/contexts/bottom-sheet-context';
import { CartIconProvider } from '@/contexts/icon-cart-context';
import { ModalProvider } from '@/contexts/modal-context';
import ReactQueryProvider from '@/contexts/react-query-provider';
import { ThemeProvider } from '@/contexts/theme-context';
import { Stack } from 'expo-router';
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="video-feed" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="product-detail" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        <Stack.Screen name="address" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        <Stack.Screen name="voucher" options={{ headerShown: false }} />
        <Stack.Screen name="upload" options={{ headerShown: false }} />
        <Stack.Screen name="live" options={{ headerShown: false }} />
        <Stack.Screen name="live-stream/room" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </Providers>

  );
}
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <ThemeProvider>
        <ReactQueryProvider>
          <CartIconProvider>
            <ModalProvider>
              <AlertProvider>
                <BottomSheetProvider>
                  {children}
                </BottomSheetProvider>
                <ModalLoading />
              </AlertProvider>
            </ModalProvider>
            <FlashMessage position="top" />
            <FlashMessageModal />
          </CartIconProvider>

        </ReactQueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

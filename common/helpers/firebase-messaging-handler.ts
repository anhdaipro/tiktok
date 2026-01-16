import { useAuthStore } from '@/stores/auth';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
const message = getMessaging();
// Register FCM background message handler
setBackgroundMessageHandler(message,async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  useAuthStore.getState().setCountNotifiUnread(prev => prev + 1);
});

import { Stack } from 'expo-router';

export default function SettingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="display" />
      <Stack.Screen name="language" />
      <Stack.Screen name="free-up-space" />
      <Stack.Screen name="qr-code" />
      <Stack.Screen name="qr-scanner" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="scanned-result" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="biometric-demo" />
      <Stack.Screen name="biometric-security" />
      <Stack.Screen name="map" />
    </Stack>
  );
}
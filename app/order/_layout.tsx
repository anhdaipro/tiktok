import { Stack } from 'expo-router';

export default function OrderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="success" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}
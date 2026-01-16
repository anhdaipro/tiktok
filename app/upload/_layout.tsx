import { Stack } from 'expo-router';

export default function UploadLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="index" />
      <Stack.Screen name="upload-text" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
      <Stack.Screen name="preview-tex" options={{ presentation: 'fullScreenModal', animation: 'fade' }}/>
      <Stack.Screen name="preview" options={{ presentation: 'fullScreenModal', animation: 'fade' }}/>
      <Stack.Screen name="post" options={{ presentation: 'fullScreenModal', animation: 'fade' }}/>
    </Stack>
  );
}
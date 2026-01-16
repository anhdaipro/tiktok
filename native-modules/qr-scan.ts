import { NativeModules } from 'react-native';

const { QrImageScanner } = NativeModules;

export const scanQRFromImage = async (uri: string|undefined): Promise<string[]> => {
    if(!uri) return [];
  // uri từ react-native-image-picker (file:// hoặc ph://)
  return await QrImageScanner.scanFromPath(uri);
};
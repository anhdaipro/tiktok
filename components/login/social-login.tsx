import { useMutationSocialLogin } from '@/hooks/react-query/auth/use-social-login';
import { showToast } from '@/services/toast';
import {
  GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import Svg, { G, Path } from 'react-native-svg';

Settings.initializeSDK()
// Cấu hình Google (Chỉ cần làm 1 lần)
GoogleSignin.configure({
  webClientId: '980633605159-j305374vkpfva1o8v5isaj6bq1262h9h.apps.googleusercontent.com', // Lấy từ Google Console

});

export const SocialLoginButtons = () => {
  const { mutate, isPending, isSuccess } = useMutationSocialLogin();
  // --- XỬ LÝ GOOGLE ---
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const idToken = response.data?.idToken;
        if (idToken) {
          mutate({ provider: 'google', token: idToken });
        }
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        console.log(error.code);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            showToast({ message: 'Login failed', type: 'danger' });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            showToast({ message: 'Play services not available or outdated', type: 'danger' });
            break;
          default:
          // some other error happened
        }
      } else {
        console.log(error);
        // an error that's not related to google sign in occurred
      }
    }

  };

  // --- XỬ LÝ FACEBOOK ---
  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) return;

      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        callBackend('facebook', data.accessToken.toString());
      }
    } catch (error) {
      console.log("FB Err:", error);
    }
  };

  // --- GỌI VỀ BACKEND CỦA BẠN ---
  const callBackend = (provider: 'google' | 'facebook', token: string) => {
    mutate({ provider, token });
  };

  return (
    <View style={styles.container}>
      {/* Nút Facebook */}
      <TouchableOpacity style={styles.btn} onPress={handleFacebookLogin}>
        <Svg style={styles.icon} viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">

          <G>
            <Path d="M256,128 C256,57.3075 198.6925,0 128,0 C57.3075,0 0,57.3075 0,128 C0,191.8885 46.80775,244.8425 108,254.445 L108,165 L75.5,165 L75.5,128 L108,128 L108,99.8 C108,67.72 127.1095,50 156.3475,50 C170.35175,50 185,52.5 185,52.5 L185,84 L168.8595,84 C152.95875,84 148,93.86675 148,103.98925 L148,128 L183.5,128 L177.825,165 L148,165 L148,254.445 C209.19225,244.8425 256,191.8885 256,128" fill="#1877F2"></Path>
            <Path d="M177.825,165 L183.5,128 L148,128 L148,103.98925 C148,93.86675 152.95875,84 168.8595,84 L185,84 L185,52.5 C185,52.5 170.35175,50 156.3475,50 C127.1095,50 108,67.72 108,99.8 L108,128 L75.5,128 L75.5,165 L108,165 L108,254.445 C114.51675,255.4675 121.196,256 128,256 C134.804,256 141.48325,255.4675 148,254.445 L148,165 L177.825,165" fill="#FFFFFF"></Path>
          </G>
        </Svg>
        <Text style={styles.text}>Tiếp tục với Facebook</Text>
      </TouchableOpacity>

      {/* Nút Google */}
      <TouchableOpacity style={styles.btn} onPress={handleGoogleLogin}>
        <Svg style={styles.icon} viewBox="-3 0 262 262" preserveAspectRatio="xMidYMid">
          <Path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" />
          <Path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" />
          <Path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" />
          <Path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" />
        </Svg>
        <Text style={styles.text}>Tiếp tục với Google</Text>
      </TouchableOpacity>

      {/* Nút Apple (Thường bắt buộc nếu có FB/Google trên iOS) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity style={styles.btn}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  btn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  text: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center'
  },
  icon: {
    width: 20,
    height: 20,
  }
});
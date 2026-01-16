import HeaderNavigate from '@/components/layout/header';
import { BiometricQuickLogin } from '@/components/login/biometric-login';
import { SocialLoginButtons } from '@/components/login/social-login';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { useLoginMutation } from '@/hooks/react-query/auth/use-mutation-login';
import { showToast } from '@/services/toast';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: loginMutation, isPending } = useLoginMutation();

  const handleLogin = () => {
    if (!email || !password) {
      showToast({ message: 'Please enter email and password', type: 'danger' });
      return;
    }
    loginMutation({
      identifier: email,
      password
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBarCustom />
      <HeaderNavigate title="Đăng nhập" />
      <TextInput
        style={[styles.input, {
          backgroundColor: colors.surface,
          color: colors.text
        }]}
        placeholder="Email hoặc TikTok ID"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, {
          backgroundColor: colors.surface,
          color: colors.text
        }]}
        placeholder="Mật khẩu"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }, isPending && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={isPending}
      >
        {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Đăng nhập</Text>}
      </TouchableOpacity>

      {/* 🔐 Biometric Quick Login */}
      <BiometricQuickLogin />

      {/* Thêm phần Social Login */}
      <View style={styles.dividerContainer}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>Hoặc tiếp tục với</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <SocialLoginButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16
  },
  btn: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
  },
});
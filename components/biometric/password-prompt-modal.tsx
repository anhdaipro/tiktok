import { useTheme } from '@/contexts/theme-context';
import { KeyRound, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface PasswordPromptModalProps {
    visible: boolean;
    biometricName: string;
    identifier: string;
    onConfirm: (password: string) => Promise<boolean>;
    onCancel: () => void;
}

/**
 * Modal yêu cầu nhập password để enable biometric login
 */
export const PasswordPromptModal = ({
    visible,
    biometricName,
    identifier,
    onConfirm,
    onCancel,
}: PasswordPromptModalProps) => {
    const { colors } = useTheme();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = async () => {
        if (!password.trim()) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        setLoading(true);
        setError('');

        const success = await onConfirm(password);

        setLoading(false);

        if (success) {
            // Reset và đóng modal
            setPassword('');
            setError('');
        } else {
            setError('Mật khẩu không đúng hoặc có lỗi xảy ra');
        }
    };

    const handleCancel = () => {
        setPassword('');
        setError('');
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: colors.card }]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                                    <KeyRound size={24} color={colors.primary} />
                                </View>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleCancel}
                                    disabled={loading}
                                >
                                    <X size={24} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            {/* Title */}
                            <Text style={[styles.title, { color: colors.text }]}>
                                Xác nhận mật khẩu
                            </Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Nhập mật khẩu của <Text style={{ fontWeight: '600' }}>{identifier}</Text> để bật {biometricName}
                            </Text>

                            {/* Password Input */}
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.background,
                                        color: colors.text,
                                        borderColor: error ? '#ef4444' : colors.border,
                                    },
                                ]}
                                placeholder="Nhập mật khẩu"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    setError('');
                                }}
                                secureTextEntry
                                autoFocus
                                editable={!loading}
                                onSubmitEditing={handleConfirm}
                            />

                            {/* Error message */}
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}

                            {/* Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.cancelButton,
                                        { borderColor: colors.border },
                                    ]}
                                    onPress={handleCancel}
                                    disabled={loading}
                                >
                                    <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                                        Hủy
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                        { backgroundColor: colors.primary },
                                        loading && { opacity: 0.7 },
                                    ]}
                                    onPress={handleConfirm}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.confirmButtonText}>Xác nhận</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {},
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

import { useTheme } from '@/contexts/theme-context';
import { useBiometric } from '@/hooks/useBiometric';
import { Fingerprint, Lock } from 'lucide-react-native';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BiometricButtonProps {
    onSuccess: () => void;
    onError?: (error: string) => void;
    promptMessage?: string;
    buttonText?: string;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Component nút xác thực sinh trắc học tái sử dụng
 * 
 * @example
 * ```tsx
 * <BiometricButton 
 *   onSuccess={() => handlePayment()}
 *   promptMessage="Xác thực để thanh toán"
 *   buttonText="Thanh toán an toàn"
 * />
 * ```
 */
export const BiometricButton: React.FC<BiometricButtonProps> = ({
    onSuccess,
    onError,
    promptMessage,
    buttonText,
    disabled = false,
    loading = false,
    variant = 'primary',
}) => {
    const { colors } = useTheme();
    const { capabilities, authenticate, getBiometricName } = useBiometric();

    const handlePress = async () => {
        if (!capabilities.isAvailable || !capabilities.isEnrolled) {
            onError?.('Sinh trắc học không khả dụng');
            return;
        }

        const result = await authenticate({
            promptMessage: promptMessage || `Xác thực bằng ${getBiometricName()}`,
        });

        if (result.success) {
            onSuccess();
        } else {
            onError?.(result.error || 'Xác thực thất bại');
        }
    };

    const isDisabled = disabled || loading || !capabilities.isAvailable || !capabilities.isEnrolled;

    const buttonStyle = [
        styles.button,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.card },
        variant === 'outline' && {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.border
        },
        isDisabled && styles.disabled,
    ];

    const textStyle = [
        styles.buttonText,
        variant === 'primary' && { color: '#fff' },
        variant === 'secondary' && { color: colors.text },
        variant === 'outline' && { color: colors.primary },
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
            ) : (
                <Fingerprint
                    size={20}
                    color={variant === 'primary' ? '#fff' : colors.primary}
                />
            )}
            <Text style={textStyle}>
                {buttonText || `Xác thực ${getBiometricName()}`}
            </Text>
        </TouchableOpacity>
    );
};

interface BiometricLockProps {
    children: React.ReactNode;
    onUnlock?: () => void;
    promptMessage?: string;
    lockMessage?: string;
}

/**
 * Component wrapper yêu cầu xác thực sinh trắc học trước khi hiển thị nội dung
 * 
 * @example
 * ```tsx
 * <BiometricLock lockMessage="Nội dung nhạy cảm">
 *   <SensitiveContent />
 * </BiometricLock>
 * ```
 */
export const BiometricLock: React.FC<BiometricLockProps> = ({
    children,
    onUnlock,
    promptMessage,
    lockMessage = 'Nội dung được bảo vệ bởi sinh trắc học',
}) => {
    const { colors } = useTheme();
    const { capabilities, authenticate, getBiometricName } = useBiometric();
    const [isUnlocked, setIsUnlocked] = React.useState(false);
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);

    const handleUnlock = async () => {
        setIsAuthenticating(true);

        const result = await authenticate({
            promptMessage: promptMessage || 'Xác thực để xem nội dung',
        });

        setIsAuthenticating(false);

        if (result.success) {
            setIsUnlocked(true);
            onUnlock?.();
        }
    };

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <View style={[styles.lockContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.lockIconContainer, { backgroundColor: colors.background }]}>
                <Lock size={40} color={colors.textSecondary} />
            </View>

            <Text style={[styles.lockMessage, { color: colors.text }]}>
                {lockMessage}
            </Text>

            <TouchableOpacity
                style={[styles.unlockButton, { backgroundColor: colors.primary }]}
                onPress={handleUnlock}
                disabled={isAuthenticating || !capabilities.isAvailable || !capabilities.isEnrolled}
            >
                {isAuthenticating ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Fingerprint size={20} color="#fff" />
                        <Text style={styles.unlockButtonText}>
                            Mở khóa bằng {getBiometricName()}
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {(!capabilities.isAvailable || !capabilities.isEnrolled) && (
                <Text style={[styles.warningText, { color: colors.textSecondary }]}>
                    Sinh trắc học không khả dụng trên thiết bị này
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
    lockContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderRadius: 12,
    },
    lockIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    lockMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    unlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    unlockButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    warningText: {
        marginTop: 16,
        fontSize: 12,
        textAlign: 'center',
    },
});

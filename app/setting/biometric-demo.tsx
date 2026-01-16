import { useTheme } from '@/contexts/theme-context';
import { useBiometric } from '@/hooks/useBiometric';
import {
    CheckCircle,
    Fingerprint,
    Info,
    Loader,
    Scan,
    ShieldCheck,
    XCircle,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BiometricDemo() {
    const { colors } = useTheme();
    const {
        capabilities,
        isChecking,
        authenticate,
        getBiometricName,
        getSecurityLevel,
        refreshCapabilities,
    } = useBiometric();

    const [securityInfo, setSecurityInfo] = useState<{
        level: string;
        description: string;
    } | null>(null);

    // Xử lý xác thực
    const handleAuthenticate = async () => {
        const result = await authenticate({
            promptMessage: 'Xác thực để truy cập tính năng bảo mật',
            cancelLabel: 'Hủy',
            fallbackLabel: 'Dùng mật khẩu',
        });
        console.log(result);

        if (result.success) {
            Alert.alert(
                '✅ Thành công',
                'Xác thực sinh trắc học thành công!',
                [{ text: 'OK' }]
            );
        } else {
            Alert.alert(
                '❌ Thất bại',
                result.error || 'Xác thực thất bại',
                result.warning ? [
                    { text: 'OK' },
                    { text: 'Cài đặt', onPress: () => console.log('Open settings') }
                ] : [{ text: 'OK' }]
            );
        }
    };

    // Kiểm tra security level
    const handleCheckSecurity = async () => {
        const info = await getSecurityLevel();
        setSecurityInfo(info);
        Alert.alert(
            'Mức độ bảo mật',
            `Level: ${info.level}\n${info.description}`
        );
    };

    // Lấy icon theo loại sinh trắc học
    const getBiometricIcon = () => {
        const iconSize = 40;
        const iconColor = colors.primary;

        switch (capabilities.biometricType) {
            case 'face':
                return <Scan size={iconSize} color={iconColor} />;
            case 'fingerprint':
                return <Fingerprint size={iconSize} color={iconColor} />;
            default:
                return <ShieldCheck size={iconSize} color={iconColor} />;
        }
    };

    if (isChecking) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Loader size={40} color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.text }]}>
                    Đang kiểm tra khả năng sinh trắc học...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    {getBiometricIcon()}
                </View>
                <Text style={[styles.title, { color: colors.text }]}>
                    Xác thực sinh trắc học
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {getBiometricName()}
                </Text>
            </View>

            {/* Status Cards */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
                    {capabilities.isAvailable ? (
                        <CheckCircle size={24} color="#22c55e" />
                    ) : (
                        <XCircle size={24} color="#ef4444" />
                    )}
                    <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                        Phần cứng
                    </Text>
                    <Text style={[styles.statusValue, { color: colors.text }]}>
                        {capabilities.isAvailable ? 'Hỗ trợ' : 'Không hỗ trợ'}
                    </Text>
                </View>

                <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
                    {capabilities.isEnrolled ? (
                        <CheckCircle size={24} color="#22c55e" />
                    ) : (
                        <XCircle size={24} color="#ef4444" />
                    )}
                    <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
                        Đã đăng ký
                    </Text>
                    <Text style={[styles.statusValue, { color: colors.text }]}>
                        {capabilities.isEnrolled ? 'Có' : 'Chưa'}
                    </Text>
                </View>
            </View>

            {/* Info Card */}
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <View style={styles.infoHeader}>
                    <Info size={20} color={colors.primary} />
                    <Text style={[styles.infoTitle, { color: colors.text }]}>
                        Thông tin chi tiết
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                        Loại sinh trắc học:
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {capabilities.biometricType === 'none'
                            ? 'Không có'
                            : getBiometricName()}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                        Số loại hỗ trợ:
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {capabilities.supportedTypes.length}
                    </Text>
                </View>

                {securityInfo && (
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Mức bảo mật:
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {securityInfo.description}
                        </Text>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.primaryButton,
                        { backgroundColor: colors.primary },
                        (!capabilities.isAvailable || !capabilities.isEnrolled) && styles.buttonDisabled,
                    ]}
                    onPress={handleAuthenticate}
                    disabled={!capabilities.isAvailable || !capabilities.isEnrolled}
                >
                    <Fingerprint size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                        Xác thực ngay
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={handleCheckSecurity}
                >
                    <ShieldCheck size={20} color={colors.text} />
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                        Kiểm tra bảo mật
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={refreshCapabilities}
                >
                    <Info size={20} color={colors.text} />
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                        Làm mới thông tin
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Warning Message */}
            {!capabilities.isEnrolled && capabilities.isAvailable && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                        ⚠️ Thiết bị hỗ trợ nhưng bạn chưa đăng ký sinh trắc học.
                        {'\n'}Vui lòng vào Cài đặt để thiết lập.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statusCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
    },
    statusLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    primaryButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    warningContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#fbbf24',
    },
    warningText: {
        fontSize: 14,
        color: '#d97706',
        lineHeight: 20,
    },
});

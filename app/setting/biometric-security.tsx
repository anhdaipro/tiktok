import CustomSwitch from '@/components/ui/switch';
import { useTheme } from '@/contexts/theme-context';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { showToast } from '@/services/toast';
import { useAuthStore } from '@/stores/auth';
import { Fingerprint, Info, ShieldCheck, User } from 'lucide-react-native';
import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

/**
 * Màn hình quản lý biometric login trong Settings
 */
export default function BiometricSecurityScreen() {
    const { colors } = useTheme();
    const { biometricEnabled, savedCredentials, user, refreshToken } = useAuthStore();
    console.log('refreshToken', refreshToken)
    const { disable, enableWithCurrentToken, isProcessing, isAvailable, biometricName } = useBiometricLogin();
    const { showConfirm } = useConfirmDialog();

    const handleToggle = async (value: boolean) => {
        if (value) {
            // Bật: Enable ngay
            if (!user?.username) {
                showToast({
                    message: 'Không tìm thấy thông tin tài khoản',
                    type: 'danger',
                });
                return;
            }

            await enableWithCurrentToken(user.username);
        } else {
            // Tắt: Hiện confirm dialog
            showConfirm({
                title: 'Tắt đăng nhập sinh trắc học?',
                description: 'Bạn sẽ cần nhập mật khẩu để đăng nhập lần sau.',
                confirmText: 'Tắt',
                cancelText: 'Hủy',
                confirmColor: '#ef4444',
                onConfirm: handleDisable,
            });
        }
    };

    const handleDisable = async () => {
        await disable();
    };

    if (!isAvailable) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.unavailableContainer}>
                    <Info size={48} color={colors.textSecondary} />
                    <Text style={[styles.unavailableTitle, { color: colors.text }]}>
                        Không khả dụng
                    </Text>
                    <Text style={[styles.unavailableText, { color: colors.textSecondary }]}>
                        Thiết bị không hỗ trợ sinh trắc học hoặc bạn chưa thiết lập {biometricName} trong cài đặt thiết bị.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
                        <Fingerprint size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Đăng nhập bằng {biometricName}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Đăng nhập nhanh và an toàn hơn
                    </Text>
                </View>

                {/* Toggle Card */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardHeaderLeft}>
                            <ShieldCheck size={24} color={colors.primary} />
                            <View style={styles.cardHeaderText}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>
                                    Đăng nhập sinh trắc học
                                </Text>
                                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                                    {biometricEnabled ? 'Đang bật' : 'Đang tắt'}
                                </Text>
                            </View>
                        </View>
                        <CustomSwitch
                            value={biometricEnabled}
                            onValueChange={handleToggle}
                            disabled={isProcessing}
                        />
                    </View>

                    {biometricEnabled && savedCredentials && (
                        <View style={[styles.credentialsInfo, { borderTopColor: colors.border }]}>
                            <User size={16} color={colors.textSecondary} />
                            <Text style={[styles.credentialsText, { color: colors.textSecondary }]}>
                                Tài khoản: {savedCredentials.identifier}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoTitle, { color: colors.text }]}>
                        Cách hoạt động
                    </Text>

                    <View style={styles.infoItem}>
                        <View style={styles.infoBullet} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Mật khẩu được mã hóa và lưu an toàn trong {'\n'}
                            {Platform.OS === 'ios' ? 'iOS Keychain' : 'Android Keystore'}
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoBullet} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Khi đăng nhập, chỉ cần xác thực {biometricName} {'\n'}thay vì nhập mật khẩu
                        </Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoBullet} />
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            Nếu {biometricName} thất bại, bạn vẫn có thể {'\n'}đăng nhập bằng mật khẩu bình thường
                        </Text>
                    </View>
                </View>

                {/* Enable Instructions if disabled */}
                {!biometricEnabled && (
                    <View style={[styles.instructionCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.instructionTitle, { color: colors.text }]}>
                            Cách bật tính năng này:
                        </Text>
                        <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                            1. Đăng xuất khỏi tài khoản hiện tại{'\n'}
                            2. Đăng nhập lại bằng email và mật khẩu{'\n'}
                            3. Chọn "Bật ngay" khi có thông báo
                        </Text>
                    </View>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
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
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
    },
    credentialsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    credentialsText: {
        fontSize: 14,
    },
    infoCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    infoBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#999',
        marginTop: 6,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    instructionCard: {
        marginHorizontal: 16,
        marginBottom: 32,
        padding: 16,
        borderRadius: 12,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        lineHeight: 24,
    },
    unavailableContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    unavailableTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    unavailableText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
});

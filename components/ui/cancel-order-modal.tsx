import FlexBox from '@/components/common/flex-box';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';
import { Circle, CircleDot } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CancelOrderModalProps {
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const CANCEL_REASONS = [
    "Muốn thay đổi địa chỉ/số điện thoại",
    "Muốn thay đổi sản phẩm/chi tiết đơn hàng",
    "Thủ tục thanh toán quá rắc rối",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Đổi ý, không muốn mua nữa",
    "Khác"
];

export const CancelOrderModal = ({
    onClose,
    onConfirm,
}: CancelOrderModalProps) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReason, setOtherReason] = useState('');

    const handleConfirm = () => {
        if (!selectedReason) return;
        const finalReason = selectedReason === 'Khác' ? otherReason : selectedReason;
        onConfirm(finalReason);
        // State reset isn't strictly necessary as component unmounts, but good practice if reused
        setSelectedReason(null);
        setOtherReason('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Hủy đơn hàng</Text>
                <Text style={styles.subtitle}>Vui lòng chọn lý do hủy</Text>
            </View>

            <View style={styles.content}>
                {CANCEL_REASONS.map((reason) => (
                    <View key={reason}>
                        <TouchableOpacity
                            style={styles.reasonRow}
                            onPress={() => setSelectedReason(reason)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.radio}>
                                {selectedReason === reason ? (
                                    <CircleDot size={20} color={colors.primary} />
                                ) : (
                                    <Circle size={20} color={colors.textSecondary} />
                                )}
                            </View>
                            <Text style={styles.reasonText}>{reason}</Text>
                        </TouchableOpacity>

                        {reason === 'Khác' && selectedReason === 'Khác' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Nhập lý do khác..."
                                placeholderTextColor={colors.textSecondary}
                                value={otherReason}
                                onChangeText={setOtherReason}
                            />
                        )}
                    </View>
                ))}
            </View>

            <FlexBox direction="row" gap={12}>
                <Button
                    variant="outline"
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                >
                    <Text style={styles.cancelButtonText}>Không phải bây giờ</Text>
                </Button>

                <Button
                    variant="primary"
                    onPress={handleConfirm}
                    disabled={!selectedReason}
                    style={[
                        styles.button,
                        styles.confirmButton,
                        { backgroundColor: selectedReason ? colors.primary : colors.border }
                    ]}
                >
                    <Text style={styles.confirmButtonText}>Hủy đơn hàng</Text>
                </Button>
            </FlexBox>
        </View>
    );
};


const createStyles = (colors: any) => StyleSheet.create({
    container: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        width: '100%',
        paddingBottom: 40,
        backgroundColor: colors.background || colors.card,
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    content: {
        marginBottom: 24,
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    radio: {
        marginRight: 12,
    },
    reasonText: {
        fontSize: 15,
        color: colors.text,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginLeft: 32,
        marginTop: 4,
        marginBottom: 12,
        fontSize: 14,
        color: colors.text,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    button: {
        flex: 1,
    },
    cancelButton: {
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    cancelButtonText: {
        color: colors.text,
    },
    confirmButton: {
        borderWidth: 0,
    },
    confirmButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
});

import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ConfirmDialogOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

/**
 * Hook để hiển thị confirm dialog sử dụng modal-context
 */
export const useConfirmDialog = () => {
    const { showModal, hideModal } = useModal();
    const { colors } = useTheme();

    const showConfirm = ({
        title,
        description,
        confirmText = 'Xác nhận',
        cancelText = 'Hủy',
        confirmColor,
        onConfirm,
        onCancel,
    }: ConfirmDialogOptions) => {
        const handleConfirm = () => {
            hideModal();
            onConfirm();
        };

        const handleCancel = () => {
            hideModal();
            onCancel?.();
        };

        showModal({
            content: (
                <View style={stylesDialog.container}>
                    <View style={[stylesDialog.dialog, { backgroundColor: colors.card }]}>
                        <Text style={[stylesDialog.title, { color: colors.text }]}>
                            {title}
                        </Text>

                        {description && (
                            <Text style={[stylesDialog.description, { color: colors.textSecondary }]}>
                                {description}
                            </Text>
                        )}

                        <View style={stylesDialog.buttonContainer}>
                            <TouchableOpacity
                                style={[stylesDialog.button, stylesDialog.cancelButton, { borderColor: colors.border }]}
                                onPress={handleCancel}
                            >
                                <Text style={[stylesDialog.cancelButtonText, { color: colors.text }]}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    stylesDialog.button,
                                    stylesDialog.confirmButton,
                                    { backgroundColor: confirmColor || colors.primary },
                                ]}
                                onPress={handleConfirm}
                            >
                                <Text style={stylesDialog.confirmButtonText}>
                                    {confirmText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ),
            animationType: 'scale',
            duration: 200,
        });
    };

    return { showConfirm };
};

const stylesDialog = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    dialog: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
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

import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmTextColor?: string;
}

export const ConfirmModal = ({
    visible,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmTextColor = '#FE2C55', // Default red for destructive actions
}: ConfirmModalProps) => {
    const { colors } = useTheme();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.container, { backgroundColor: '#fff' }]}>
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                            {description && (
                                <Text style={[styles.description, { color: colors.textSecondary }]}>
                                    {description}
                                </Text>
                            )}

                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                                    onPress={onCancel}
                                >
                                    <Text style={[styles.buttonText, { color: colors.text }]}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton, { borderColor: colors.border }]}
                                    onPress={onConfirm}
                                >
                                    <Text style={[styles.buttonText, { color: confirmTextColor, fontWeight: '600' }]}>{confirmText}</Text>
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
        padding: 40,
    },
    container: {
        width: '100%',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
    },
    confirmButton: {
        backgroundColor: '#fff',
    },
    buttonText: {
        fontSize: 14,
    },
});

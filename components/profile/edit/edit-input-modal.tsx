import FlexBox from '@/components/common/flex-box';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditInputModalProps {
    title: string;
    value: string;
    onSubmit: (val: string) => void;
    multiline?: boolean;
    maxLength?: number;
}

export const EditInputModal = ({ title, value: initialValue, onSubmit, multiline, maxLength }: EditInputModalProps) => {
    const [text, setText] = useState(initialValue || '');
    const { colors } = useTheme();
    const { hideModal } = useModal();
    const styles = createStyles(colors);

    const handleSave = () => {
        onSubmit(text);
        hideModal();
    }

    return (
        <View style={styles.container}>
            <FlexBox direction="row" justify="space-between" align="center" style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() =>hideModal()}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
            </FlexBox>
            
            <View style={styles.inputContainer}>
                <TextInput 
                    style={[styles.input, multiline && styles.multilineInput]}
                    value={text}
                    onChangeText={setText}
                    multiline={multiline}
                    maxLength={maxLength}
                    placeholder={`Nhập ${title.toLowerCase()}`}
                    placeholderTextColor={colors.textSecondary}
                    autoFocus
                />
                {maxLength && (
                    <Text style={styles.counter}>{text.length}/{maxLength}</Text>
                )}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    )
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        padding: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        minHeight: 250, // Chiều cao tối thiểu cho bottom sheet
    },
    header: { marginBottom: 20 },
    title: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    inputContainer: { marginBottom: 20 },
    input: {
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 8,
        color: colors.text,
        fontSize: 16,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    counter: {
        textAlign: 'right',
        color: colors.textSecondary,
        marginTop: 4,
        fontSize: 12,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
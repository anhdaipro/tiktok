import { useTheme } from '@/contexts/theme-context';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VoucherBackground from '../svg/voucher-background';

interface VoucherCardProps {
    title: string;
    description: string;
    validUntil: string;
    tag?: string;
    source?: string;
    variant?: 'default' | 'gradient';
    onPress?: () => void;
}

export const VoucherCard = ({
    title,
    description,
    validUntil,
    tag,
    source,
    variant = 'default',
}: VoucherCardProps) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Voucher Background with cutouts */}
            <VoucherBackground
                width={400}
                height={140}
                gradientColors={
                    variant === 'gradient'
                        ? [
                            { offset: '0%', color: '#8B1538' },
                            { offset: '100%', color: '#C41E3A' },
                        ]
                        : undefined
                }
                backgroundColor={variant === 'default' ? '#2A2A2A' : undefined}
                circleCutouts={[
                    { position: 'left', offset: 71.4, radius: 6 }, // 100/140 * 100 = 71.4%
                    { position: 'right', offset: 71.4, radius: 6 },
                ]}
                borderRadius={12}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {tag && (
                        <View style={styles.tagContainer}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    )}
                    {source && (
                        <View style={styles.sourceContainer}>
                            <Text style={styles.sourceText}>{source}</Text>
                        </View>
                    )}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.validUntil}>{validUntil}</Text>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Nhận</Text>
                    </View>
                </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 140,
        marginBottom: 12,
        position: 'relative',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 1,
    },
    leftSection: {
        flex: 1,
        justifyContent: 'space-between',
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 4,
    },
    tagText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
    sourceContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginBottom: 8,
    },
    sourceText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '500',
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        marginBottom: 8,
    },
    validUntil: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
    },
    rightSection: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 12,
    },
    button: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#FF2D55',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    dottedLine: {
        position: 'absolute',
        right: 90,
        top: 0,
        bottom: 0,
        width: 1,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        borderStyle: 'dashed',
    },
});

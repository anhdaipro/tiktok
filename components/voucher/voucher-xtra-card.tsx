import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FlexBox from '../common/flex-box';
import VoucherBackground from '../svg/voucher-background';

interface VoucherXtraCardProps {
    title: string;
    description: string;
    tag?: string;
    source?: string;
    onPress?: () => void;
}
const LAYOUT = {
    width: 300,
    height: 80,
}
export const VoucherXtraCard = ({
    title,
    description,
    tag,
    source,
    onPress,
}: VoucherXtraCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            {/* Voucher Background with gradient and cutouts */}
            <VoucherBackground
                width={LAYOUT.width}
                height={LAYOUT.height}
                gradientColors={[
                    { offset: '0%', color: '#5A0F1F' },
                    { offset: '50%', color: '#8B1538' },
                    { offset: '100%', color: '#A01D3A' },
                ]}
                circleCutouts={[
                    { position: 'left', offset: 50, radius: 5 },
                    { position: 'right', offset: 50, radius: 5 },
                ]}
                borderRadius={8}
            />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <FlexBox direction='row' gap={4}>
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
                    </FlexBox>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Nhận</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: LAYOUT.height,
        marginRight: 12,
        width: LAYOUT.width,
        position: 'relative',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        zIndex: 1,
    },
    leftSection: {
        flex: 1,
        justifyContent: 'space-between',
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginBottom: 2,
    },
    tagText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '600',
    },
    sourceContainer: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
        marginBottom: 6,
    },
    sourceText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '500',
    },
    title: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    description: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
    },
    rightSection: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 8,
    },
    button: {
        backgroundColor: '#FF2D55',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 16,
        shadowColor: '#FF2D55',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    dottedLine: {
        position: 'absolute',
        right: 70,
        top: 0,
        bottom: 0,
        width: 1,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        borderStyle: 'dashed',
    },
});

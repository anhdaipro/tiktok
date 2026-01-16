import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import {
    FileText,
    Gift,
    MapPin,
    MessageCircle,
    ShoppingBag,
    Sparkles,
    Tag,
    Video
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUICK_LINKS = [
    { id: 'orders', icon: FileText, label: 'Đơn hàng', color: '#333' },
    { id: 'voucher', icon: Sparkles, label: 'Voucher', color: '#FF6B6B' }, // Changed icon to Sparkles
    { id: 'live', icon: Video, label: 'LIVE', color: '#FF2D55' },
    { id: 'messages', icon: MessageCircle, label: 'Tin nhắn', color: '#4ECDC4' },
    { id: 'mall', icon: ShoppingBag, label: 'HÀNG VIỆT', color: '#FFD93D' },
    { id: 'rewards', icon: Gift, label: 'Thưởng', color: '#00D9FF' }, // Changed color to #00D9FF
    { id: 'location', icon: MapPin, label: 'Địa chỉ', color: '#95E1D3' },
    { id: 'settings', icon: FileText, label: 'Cài đặt', color: '#6C5CE7' },
    { id: 'help', icon: Tag, label: 'Trợ giúp', color: '#FD79A8' },
    { id: 'notifications', icon: MessageCircle, label: 'Thông báo', color: '#FDCB6E' },
    { id: 'favorites', icon: Gift, label: 'Yêu thích', color: '#E17055' },
];

export const QuickLinks = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => createThemedStyles(colors), [colors]);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {QUICK_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                        <TouchableOpacity key={link.id} style={styles.linkItem} onPress={() => router.push(`/${link.id}`)}>
                            <View style={styles.iconContainer}>
                                <Icon size={24} color={link.color} />
                            </View>
                            <Text style={styles.linkLabel}>{link.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const createThemedStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            paddingVertical: 16,
        },
        scrollContent: {
            paddingHorizontal: 12,
            gap: 8,
        },
        linkItem: {
            alignItems: 'center',
            width: 60,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 6,
            backgroundColor: '#F5F5F5',
        },
        linkLabel: {
            fontSize: 11,
            color: colors.text,
            textAlign: 'center',
        },
    });


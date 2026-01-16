import FlexBox from '@/components/common/flex-box';
import { CancelOrderModal } from '@/components/ui/cancel-order-modal';
import StatusBarCustom from '@/components/ui/status-bar';
import { useModal } from '@/contexts/modal-context';
import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, Box, ChevronRight, Clock, HelpCircle, MapPin, MessageCircle, Package, Truck } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Step = ({ icon: Icon, label, active, isLast }: any) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={[styles.stepIcon, active && { backgroundColor: '#00BFA5' }]}>
                <Icon size={16} color={active ? 'white' : colors.textSecondary} />
            </View>
            <Text style={[styles.stepLabel, active && { color: '#00BFA5' }]}>{label}</Text>
            {!isLast && <View style={[styles.stepLine, active && { backgroundColor: '#00BFA5' }]} />}
        </View>
    )
}

export default function OrderDetailScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const { showModal, hideModal } = useModal();

    return (
        <View style={styles.container}>
            <StatusBarCustom />
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Đã đặt hàng</Text>
                    <Text style={styles.headerSub}>Đang đến 13-16 tháng 12</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stepper */}
                <View style={styles.section}>
                    <View style={styles.stepperContainer}>
                        <Step icon={Box} label="Đã đặt hàng" active />
                        <Step icon={Truck} label="Chờ chuyển phát" />
                        <Step icon={Package} label="Đang trung chuyển" />
                        <Step icon={Box} label="Đã giao đơn hàng" isLast />
                    </View>
                    <View style={styles.guaranteeBox}>
                        <Clock size={16} color="#00BFA5" style={{ marginTop: 2 }} />
                        <Text style={styles.guaranteeText}>
                            Dịch vụ Đảm bảo giao hàng đúng hạn cam đoan sẽ có lần đến giao chậm nhất là 16 tháng 12. Nhận voucher nếu đơn đến muộn.
                        </Text>
                    </View>
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <FlexBox direction="row" gap={12}>
                        <MapPin size={20} color={colors.textSecondary} style={{ marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.addressName}>Phạm Đại (+84)03******10</Text>
                            <Text style={styles.addressDetail}>
                                Công Ty Cổ Phần Dầu Khí Miền Nam, 86 Đường Nguyễn Cửu Vân, Phường 17, không giao vào chiều t6 - đến hết cn, ...
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.changeAddressText}>Thay đổi địa chỉ</Text>
                            </TouchableOpacity>
                        </View>
                    </FlexBox>
                </View>

                {/* Product */}
                <View style={styles.section}>
                    <FlexBox direction="row" align="center" justify="space-between" style={{ marginBottom: 12 }}>
                        <Text style={styles.shopName}>ĐỒ CHƠI THÔNG MINH NHÀ KEN</Text>
                        <ChevronRight size={16} color={colors.textSecondary} />
                    </FlexBox>

                    <FlexBox direction="row" gap={12}>
                        <Image source={{ uri: 'https://i.imgur.com/dHy2fWw.png' }} style={styles.productImage} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.productTitle} numberOfLines={1}>Hầm Khủng Long, Đường hầm sư tử kèm...</Text>
                            <Text style={styles.productVariant}>Đường hầm sư tử</Text>
                            <FlexBox direction="row" gap={8} style={{ marginTop: 4 }}>
                                <View style={styles.tag}><Text style={styles.tagText}>Tự tin mua sắm</Text></View>
                                <View style={styles.tag}><Text style={styles.tagText}>Trả hàng miễn phí</Text></View>
                            </FlexBox>
                            <FlexBox direction="row" justify="space-between" align="flex-end" style={{ marginTop: 8 }}>
                                <Text style={styles.quantity}>x1</Text>
                                <Text style={styles.price}>345.900đ</Text>
                            </FlexBox>
                        </View>
                    </FlexBox>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                    <Package size={18} color={colors.text} />
                    <Text style={styles.actionText}>Trả hàng miễn phí thuận tiện</Text>
                    <ChevronRight size={18} color={colors.textSecondary} />
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.contactRow}>
                        <MessageCircle size={20} color={colors.textSecondary} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.contactTitle}>Liên hệ với người bán</Text>
                            <Text style={styles.contactSub}>Vấn đề về sản phẩm, trước khi vận chuyển và các câu hỏi khác</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.contactRow}>
                        <HelpCircle size={20} color={colors.textSecondary} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.contactTitle}>Liên hệ với TikTok</Text>
                            <Text style={styles.contactSub}>Vấn đề về tài khoản, thanh toán, khiếu nại và sau vận chuyển</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Summary */}
                <View style={[styles.section, { marginBottom: 100 }]}>
                    <Text style={styles.summaryTitle}>Tổng quan đơn hàng</Text>
                    <FlexBox direction="row" justify="space-between" style={{ marginTop: 12 }}>
                        <Text style={styles.summaryLabel}>Tổng phụ</Text>
                        <Text style={styles.summaryValue}>345.900đ</Text>
                    </FlexBox>
                    <FlexBox direction="row" justify="space-between" style={{ marginTop: 8 }}>
                        <Text style={styles.summaryLabel}>Vận chuyển</Text>
                        <Text style={styles.summaryValue}>0đ</Text>
                    </FlexBox>
                    <FlexBox direction="row" justify="space-between" style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: colors.border }}>
                        <Text style={[styles.summaryLabel, { fontWeight: 'bold', color: colors.text }]}>Tổng cộng</Text>
                        <Text style={[styles.summaryValue, { fontWeight: 'bold', color: '#FE2C55', fontSize: 16 }]}>345.900đ</Text>
                    </FlexBox>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 12 }]}>
                <TouchableOpacity style={styles.bottomBtnSecondary} onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}>
                    <Text style={styles.bottomBtnTextSecondary}>Thay đổi địa chỉ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtnSecondary} onPress={() => {
                    showModal({
                        content: (
                            <CancelOrderModal
                                onClose={() => hideModal()}
                                onConfirm={(reason) => {
                                    hideModal();
                                    setTimeout(() => {
                                        Alert.alert('Thành công', `Đã hủy đơn hàng\nLý do: ${reason}`);
                                    }, 300);
                                }}
                            />
                        ),
                        animationType: "slide-bottom",
                        styleModalContent: { justifyContent: 'flex-end', padding: 0, margin: 0 },
                    })
                }}>
                    <Text style={styles.bottomBtnTextSecondary}>Hủy đơn hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 12, backgroundColor: colors.background,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 17, fontWeight: 'bold', color: colors.text },
    headerSub: { fontSize: 13, color: colors.success },
    content: { flex: 1 },

    section: { backgroundColor: colors.background, marginTop: 8, padding: 16 },

    // Stepper
    stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    stepIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 8, zIndex: 1 },
    stepLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', maxWidth: 80 },
    stepLine: { position: 'absolute', top: 12, left: '50%', width: '100%', height: 2, backgroundColor: colors.border, zIndex: 0 },

    guaranteeBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.successLight, padding: 12, borderRadius: 4 },
    guaranteeText: { flex: 1, fontSize: 12, color: colors.successDark, lineHeight: 16 },

    // Address
    addressName: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
    addressDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 },
    changeAddressText: { fontSize: 13, color: colors.info, fontWeight: '500' },

    // Product
    shopName: { fontSize: 13, fontWeight: 'bold', color: colors.text },
    productImage: { width: 70, height: 70, borderRadius: 4, backgroundColor: colors.surface },
    productTitle: { fontSize: 14, color: colors.text, marginBottom: 4 },
    productVariant: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
    tag: { backgroundColor: colors.warningLight, paddingHorizontal: 4, paddingVertical: 2, borderRadius: 2, marginRight: 4 },
    tagText: { fontSize: 10, color: colors.warning },
    quantity: { fontSize: 14, color: colors.textSecondary },
    price: { fontSize: 15, fontWeight: '600', color: colors.text },

    // Actions
    actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorLight, padding: 12, marginTop: 8, gap: 8 },
    actionText: { flex: 1, fontSize: 13, color: colors.text },

    contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    contactTitle: { fontSize: 14, color: colors.text, marginBottom: 2 },
    contactSub: { fontSize: 12, color: colors.textSecondary },
    divider: { height: 0.5, backgroundColor: colors.border, marginLeft: 32 },

    // Summary
    summaryTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
    summaryLabel: { fontSize: 14, color: colors.textSecondary },
    summaryValue: { fontSize: 14, color: colors.text },

    // Bottom Bar
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: colors.background, flexDirection: 'row', padding: 12, gap: 12,
        borderTopWidth: 0.5, borderTopColor: colors.border,
    },
    bottomBtnSecondary: {
        flex: 1, paddingVertical: 10, borderRadius: 4,
        borderWidth: 1, borderColor: colors.border, alignItems: 'center',
        backgroundColor: colors.background
    },
    bottomBtnTextSecondary: { fontSize: 14, fontWeight: '600', color: colors.text },
});
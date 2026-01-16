import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { Image } from "expo-image";
import { ChevronRight, Globe, Link as LinkIcon, MapPin, MoreHorizontal } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const SettingItem = React.memo(({ icon: Icon, label, subLabel, rightContent }: any) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, justifyContent: 'space-between' }}>
            <FlexBox direction="row" align="center" gap={12}>
                <Icon size={20} color={colors.text} />
                <View>
                    <Text style={{ fontSize: 15, color: colors.text }}>{label}</Text>
                    {subLabel && <Text style={{ fontSize: 12, color: colors.textSecondary }}>{subLabel}</Text>}
                </View>
            </FlexBox>
            <FlexBox direction="row" align="center" gap={4}>
                {rightContent && <Text style={{ fontSize: 13, color: colors.textSecondary }}>{rightContent}</Text>}
                <ChevronRight size={18} color={colors.textSecondary} />
            </FlexBox>
        </TouchableOpacity>
    )
});

const ShareIcon = React.memo(({ source }: { source: string }) => (
    <Image source={{ uri: source }} style={{ width: 32, height: 32, borderRadius: 16 }} />
));

export default function PostSettings() {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.settingsList}>
            <SettingItem icon={MapPin} label="Vị trí" rightContent="Chọn vị trí" />
            <SettingItem icon={LinkIcon} label="Thêm liên kết" />
            <SettingItem icon={Globe} label="Ai cũng có thể xem bài đăng này" rightContent="Mọi người" />
            <SettingItem icon={MoreHorizontal} label="Tùy chọn khác" subLabel="Quản lý chất lượng tải lên" />

            <View style={styles.shareSection}>
                <Text style={styles.shareLabel}>Chia sẻ với</Text>
                <FlexBox direction="row" gap={16}>
                    <ShareIcon source="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" />
                    <ShareIcon source="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" />
                    <ShareIcon source="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png" />
                </FlexBox>
            </View>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    settingsList: { paddingHorizontal: 16 },
    shareSection: { paddingVertical: 16 },
    shareLabel: {
        fontSize: 15,
        color: colors.text,
        marginBottom: 12
    },
});

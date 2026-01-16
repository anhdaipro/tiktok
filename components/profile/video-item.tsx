import FlexBox from "@/components/common/flex-box";
import { useTheme } from "@/contexts/theme-context";
import { Video } from "@/types/video";
import { Image } from "expo-image";
import { Play } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
interface Props {
    item: Video;
    onPress: () => void;
}
const VideoItem: React.FC<Props> = ({
    item,
    onPress,
}) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: colors.background }]}>
            <Image contentFit="cover" source={{ uri: item.thumbnailUrl }} style={styles.image} />
            <FlexBox direction="row" align="center" style={styles.viewCountContainer} gap={2}>
                <Play size={10} color={colors.card} fill={colors.card} />
                <Text style={[styles.viewCountText, { color: colors.card }]}>{item.views || '0'}</Text>
            </FlexBox>
        </TouchableOpacity>
    )
}
export default VideoItem;

const styles = StyleSheet.create({
    container: {
        height: 150,
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    viewCountContainer: {
        position: 'absolute',
        bottom: 4,
        left: 4,
    },
    viewCountText: {
        fontSize: 10,
        fontWeight: 'bold',
    }
});
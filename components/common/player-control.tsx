import { useTheme } from "@/contexts/theme-context";
import { useEvent } from "expo";
import { VideoPlayer } from "expo-video";
import { PlayIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
interface Props {
    player: VideoPlayer;
}
const SIZE_ICON_PLAY = 52
const PlayerControl = ({ player }: Props) => {
    const { colors } = useTheme()
    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
    const [isSliding, setIsSliding] = useState(false);
    const handlePlayVideo = () => {
        if (isPlaying) {
            player.pause();
            setIsSliding(false)
        } else {
            setIsSliding(true)
            player.play();
        }
    };
    return (
        <Pressable onPress={handlePlayVideo} style={[StyleSheet.absoluteFill, styles.container]}>
            {!isPlaying && !isSliding ? <PlayIcon
                opacity={0.8}
                size={SIZE_ICON_PLAY}
                fill={colors.white}
                color={colors.white}
                style={[styles.pauseIcon]}
            /> : null}
        </Pressable>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pauseIcon: {
        position: 'absolute',
    },
})
export default PlayerControl
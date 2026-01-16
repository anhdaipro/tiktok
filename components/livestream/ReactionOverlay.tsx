import { useLivestreamStore } from '@/stores/livestream.store';
import { Gift, Heart } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const REACTION_DURATION = 2000;
const ANIMATION_DURATION = 1500;

interface ReactionItem {
    id: string;
    type: 'like' | 'heart' | 'gift' | 'coin';
    animation: Animated.Value;
}

export const ReactionOverlay: React.FC = () => {
    const { reactions } = useLivestreamStore();
    const [activeReactions, setActiveReactions] = React.useState<ReactionItem[]>([]);

    useEffect(() => {
        if (reactions.length === 0) return;

        const latestReaction = reactions[reactions.length - 1];
        const animValue = new Animated.Value(0);

        const reactionItem: ReactionItem = {
            id: latestReaction.id,
            type: latestReaction.type,
            animation: animValue,
        };

        setActiveReactions((prev) => [...prev, reactionItem]);

        // Animate up and fade out
        Animated.timing(animValue, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        // Remove after duration
        setTimeout(() => {
            setActiveReactions((prev) =>
                prev.filter((r) => r.id !== latestReaction.id)
            );
        }, REACTION_DURATION);
    }, [reactions]);

    const renderReaction = (item: ReactionItem) => {
        const translateY = item.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200],
        });

        const opacity = item.animation.interpolate({
            inputRange: [0, 0.1, 0.9, 1],
            outputRange: [0, 1, 1, 0],
        });

        const scale = item.animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 1.2, 1],
        });

        return (
            <Animated.View
                key={item.id}
                style={[
                    styles.reaction,
                    {
                        transform: [{ translateY }, { scale }],
                        opacity,
                    },
                ]}
            >
                {item.type === 'heart' && <Heart size={40} color="#FF2D55" fill="#FF2D55" />}
                {item.type === 'like' && <Heart size={40} color="#FFD700" fill="#FFD700" />}
                {item.type === 'gift' && <Gift size={40} color="#FF4081" />}
            </Animated.View>
        );
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {activeReactions.map(renderReaction)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 350,
        right: 20,
        width: 60,
        height: 300,
    },
    reaction: {
        position: 'absolute',
        bottom: 0,
    },
});

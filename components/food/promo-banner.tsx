import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import {
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PromoBannerProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    imageSource?: ImageSourcePropType;
    onPress?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
    title = 'Có thực mới vực',
    subtitle = 'được mood',
    buttonText = 'ĐẶT MÓN NGAY',
    imageSource,
    onPress,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>

                {/* Illustration */}
                {imageSource && (
                    <Image source={imageSource} style={styles.illustration} />
                )}
            </View>
        </View>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            marginHorizontal: 16,
            marginVertical: 8,
            borderRadius: 16,
            backgroundColor: '#FFE5EC',
            overflow: 'hidden',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 20,
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
        },
        subtitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FE2C55',
            fontStyle: 'italic',
            marginBottom: 12,
        },
        button: {
            backgroundColor: '#FE2C55',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 6,
            alignSelf: 'flex-start',
            borderWidth: 2,
            borderColor: '#FE2C55',
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
        },
        illustration: {
            width: 120,
            height: 120,
        },
    });

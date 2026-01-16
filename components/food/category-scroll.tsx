import { useTheme } from '@/contexts/theme-context';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import {
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface FoodCategory {
    id: string;
    name: string;
    image: ImageSourcePropType;
}

interface CategoryScrollProps {
    categories: FoodCategory[];
    onCategoryPress?: (category: FoodCategory) => void;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
    categories,
    onCategoryPress,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => onCategoryPress?.(category)}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <Image source={category.image} style={styles.icon} />
                    </View>
                    <Text style={styles.label} numberOfLines={2}>
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 12,
            paddingVertical: 12,
            gap: 16,
        },
        categoryItem: {
            alignItems: 'center',
            width: 70,
        },
        iconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
            overflow: 'hidden',
        },
        icon: {
            width: 64,
            height: 64,
        },
        label: {
            fontSize: 12,
            color: colors.text,
            textAlign: 'center',
            lineHeight: 16,
        },
    });

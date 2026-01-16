import { useTheme } from '@/contexts/theme-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type TabType = 'delivery' | 'dine-in';

interface CurvedTabSwitcherProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const CurvedTabSwitcher: React.FC<CurvedTabSwitcherProps> = ({
    activeTab,
    onTabChange,
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            {/* Delivery Tab */}
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === 'delivery' && styles.activeTab,
                ]}
                onPress={() => onTabChange('delivery')}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="bicycle"
                    size={20}
                    color={activeTab === 'delivery' ? '#FE2C55' : colors.textSecondary}
                />
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 'delivery' && styles.activeTabText,
                    ]}
                >
                    Giao tận nơi
                </Text>
            </TouchableOpacity>

            {/* SVG Curved Divider */}
            <View style={styles.svgContainer}>
                <Svg width="30" height="55" viewBox="0 0 30 55">
                    <Path
                        d={
                            activeTab === 'delivery'
                                ? 'M 0 0 Q 8 27.5 0 55 L 0 0 Z'
                                : 'M 30 0 Q 22 27.5 30 55 L 30 0 Z'
                        }
                        fill={colors.white}
                    />
                </Svg>
            </View>

            {/* Dine-in Tab */}
            <TouchableOpacity
                style={[
                    styles.tab,
                    activeTab === 'dine-in' && styles.activeTab,
                ]}
                onPress={() => onTabChange('dine-in')}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="restaurant"
                    size={20}
                    color={activeTab === 'dine-in' ? '#FE2C55' : colors.textSecondary}
                />
                <Text
                    style={[
                        styles.tabText,
                        activeTab === 'dine-in' && styles.activeTabText,
                    ]}
                >
                    Ăn tại chỗ
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            marginVertical: 12,
            height: 55,
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 40,
            backgroundColor: colors.surface,
            borderRadius: 20,
        },
        activeTab: {
            height: 55,
            backgroundColor: colors.white,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textSecondary,
        },
        activeTabText: {
            color: '#FE2C55',
            fontWeight: '600',
        },
        svgContainer: {
            width: 30,
            height: 55,
            marginHorizontal: -15,
            zIndex: 1,
        },
    });

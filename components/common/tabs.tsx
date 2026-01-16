import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { LucideIcon } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, interpolateColor, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface TabConfig<T> {
  id: T;
  icon?: LucideIcon;
  label?: string;
}

interface TabsProps<T> {
  onTabChange: (tab: T) => void;
  tabs: TabConfig<T>[];
  width: number;
  scrollX: SharedValue<number>;
}
const WIDTH_UNDERLINE = 30;
interface TabProps<T> {
  onTabChange: (tab: T) => void;
  index: number;
  tab: TabConfig<T>;
  scrollX: SharedValue<number>;
}
const TabItem = function TabItem<T>({ onTabChange, tab, scrollX, index }: TabProps<T>) {
  const { colors } = useTheme();
  const styles = createThemedStyles(colors);

  const { id, icon: Icon, label } = tab;
  const AnimatedIcon = Icon ? Animated.createAnimatedComponent(Icon) : null;

  // Animation for Text Color
  const animatedTextStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      scrollX.value,
      [index - 1, index - 0.2, index, index + 0.2, index + 1],
      [colors.textSecondary, colors.text, colors.text, colors.text, colors.textSecondary]
    );
    return {
      color: textColor,
    };
  });

  // Animation for Icon: Cross-fade using opacity
  const activeIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0]
    );
    return { opacity };
  });

  const inactiveIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [1, 0, 1]
    );
    return { opacity };
  });

  return (
    <TouchableOpacity key={String(id)} style={styles.tab} onPress={() => onTabChange(id)}>
      {Icon && (
        <View>
          {/* Inactive Icon Layer */}
          <Animated.View style={inactiveIconStyle}>
            <Icon size={24} color={colors.textSecondary} />
          </Animated.View>

          {/* Active Icon Layer (Overlay) */}
          <Animated.View style={[StyleSheet.absoluteFill, activeIconStyle]}>
            <Icon size={24} color={colors.text} />
          </Animated.View>
        </View>
      )}
      {label ? <Animated.Text style={animatedTextStyle}>{label}</Animated.Text> : null}
    </TouchableOpacity>
  );
};
export const Tabs = <T extends string | number>({ onTabChange, tabs, width, scrollX }: TabsProps<T>) => {
  const { colors } = useTheme();
  const styles = createThemedStyles(colors);
  const tabWidth = width / tabs.length;

  const animatedUnderlineStyle = useAnimatedStyle(() => {
    const centerX = (tabWidth - WIDTH_UNDERLINE) / 2;
    return {
      transform: [{ translateX: (scrollX.value * tabWidth) + centerX }],
    };
  });


  return (
    <View style={styles.container}>
      <FlexBox direction="row" justify='center' style={[{ width }]}>
        {tabs.map((tab, index) =>
          <TabItem key={String(tab.id)} index={index} onTabChange={onTabChange} tab={tab} scrollX={scrollX} />
        )}
      </FlexBox>
      <Animated.View style={[styles.underline, { width: WIDTH_UNDERLINE }, animatedUnderlineStyle]} />
    </View>
  );
};

const createThemedStyles = (colors: any) => StyleSheet.create({
  container: {

  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {

    borderBottomWidth: 2,
    borderColor: colors.text,
  },
  underline: {
    height: 2,
    backgroundColor: colors.text,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default memo(Tabs) as typeof Tabs;
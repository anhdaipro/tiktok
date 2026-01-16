import React from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, StyleProp } from 'react-native';

interface CardGridProps {
  children: React.ReactNode;
  col?: number; // số cột (mặc định 2)
  gap?: number; // khoảng cách giữa các card
  paddingHorizontal?: number;
  style?: ViewStyle;
  border?: number;
}

const GridView: React.FC<CardGridProps> = ({
  children,
  col = 2,
  gap = 12,
  paddingHorizontal = 16,
  border = 0,
  style,
}) => {
  const { width } = Dimensions.get('window');
  const totalGap = gap * (col - 1);
  const extraSpacing = border * col;
  const cardWidth = (width - paddingHorizontal * 2 - totalGap - extraSpacing) / col;
  // ép children thành mảng để map width
  const childrenArray = React.Children.toArray(children);

  return (
    <View
      style={[
        styles.container,
        { paddingHorizontal, gap },
        style,
      ]}
    >
      {childrenArray.map((child, index) => {
        if (React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child)) {
          return React.cloneElement(child, {
            style: [
              child.props.style,
              { width: cardWidth },
            ],
            key: index,
          });
        }
        return child;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default GridView;

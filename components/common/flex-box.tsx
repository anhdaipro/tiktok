import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

export interface FlexBoxProps extends ViewProps {
  children?: React.ReactNode;
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  wrap?: FlexWrap;
  gap?: number;
  rowGap?: number;
  columnGap?: number;
  flex?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A reusable View component with built-in Flexbox props for easier layout management.
 *
 * @param {FlexBoxProps} props - The props for the component.
 * @returns {React.ReactElement} A View component configured with flexbox styles.
 */
const FlexBox: React.FC<FlexBoxProps> = ({
  children, 
  direction, 
  justify, 
  align, 
  wrap, 
  gap, 
  rowGap, 
  columnGap, 
  flex,
  style,
  ...rest
}: FlexBoxProps): React.ReactElement => {
  // Tạo style object từ các props
  const flexStyle: ViewStyle = {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    gap,
    rowGap,
    columnGap,
    flex,
  };

  return (
    <View style={[flexStyle, style]} {...rest}>
      {children}
    </View>
  );
};
export default FlexBox;
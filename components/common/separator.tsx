import React from 'react';
import { View, ViewProps } from 'react-native';
interface SeparatorProps extends ViewProps {
  color?: string;
  height?: number;
}

const Separator: React.FC<SeparatorProps> = ({ 
  color, 
  height,
  style,
}) => {
  return <View style={[{ 
    height: height, 
    backgroundColor: color,
  }, style]} />;
};
export default Separator;

import { Colors } from '@/constants/theme';
import React from 'react';
import Svg, { Line, SvgProps } from 'react-native-svg';

interface VerticalDashedLineProps {
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
  dashArray?: number[]; // ví dụ [4, 2] => 4px line, 2px gap
  style?: SvgProps['style'];
}
const VerticalDashedLine: React.FC<VerticalDashedLineProps> = ({
  height = 100,
  strokeWidth = 1,
  strokeColor = Colors.static.white,
  dashArray = [4, 2],
  style,
}) => {
  return (
    <Svg width={strokeWidth} height={height} style={style}>
      <Line
        x1={strokeWidth / 2}
        y1={0}
        x2={strokeWidth / 2}
        y2={height}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
    </Svg>
  );
};

export default VerticalDashedLine;
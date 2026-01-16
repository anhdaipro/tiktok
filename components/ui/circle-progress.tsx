import React from 'react';
import Svg, { Circle, SvgProps } from 'react-native-svg';

const SIZE = 120;        // Kích thước SVG (120x120)
const STROKE = 6;        // Độ dày nét vẽ


// progress: giá trị từ 0 → 1
// 0 = chưa vẽ gì
// 1 = vẽ đủ 1 vòng
interface CircleProgressProps {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  style?:SvgProps['style'];
}
const CircleProgress: React.FC<CircleProgressProps> = ({ 
  progress = 0,
  size = SIZE,
  stroke = STROKE,
  color = '#ddd',
  style,
}) =>{

  const CENTER = size / 2; // Tọa độ tâm

  // Bán kính hình tròn
  // = nửa kích thước SVG - nửa độ dày nét
  // Trừ stroke/2 để nét KHÔNG bị cắt
  const RADIUS = CENTER - stroke / 2;

  // Chu vi hình tròn
  // Công thức: 2 * PI * r
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  // Phần chu vi bị ẩn
  // progress = 0.7 → ẩn 30%
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style}>
      {/* Vòng tròn progress */}
      <Circle
        cx={CENTER}          // tâm X
        cy={CENTER}          // tâm Y
        r={RADIUS}           // bán kính
        stroke={color}
        strokeWidth={stroke}
        fill="transparent"
        strokeLinecap="round" // bo tròn 2 đầu nét
        // Tổng chiều dài nét = chu vi hình tròn
        strokeDasharray={CIRCUMFERENCE}
        // Phần nét bị ẩn đi
        strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}

        // SVG mặc định bắt đầu vẽ từ hướng 3 giờ
        // Xoay -90 độ để bắt đầu từ hướng 12 giờ
        rotation="-90"
        origin={`${CENTER}, ${CENTER}`}
      />
    </Svg>
  );
}
export default CircleProgress;

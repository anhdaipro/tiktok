import React from 'react';
import Svg, { Circle, G, Line, Path, Text } from 'react-native-svg';
const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
};

const createSlicePath = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    Z
  `;
};

const SIZE = 300;
const RADIUS = SIZE / 2;

type Slice = {
    color: string;
    label: string;
};

export const WheelSvg = ({ slices }: { slices: Slice[] }) => {
    const anglePerSlice = 360 / slices.length;

    return (
        <Svg width={SIZE} height={SIZE}>
            <G>
                {/* 1️⃣ Vẽ các slice (CHỈ fill) */}
                {slices.map((slice, index) => {
                    const startAngle = index * anglePerSlice;
                    const endAngle = startAngle + anglePerSlice;
                    const middleAngle = startAngle + anglePerSlice / 2;

                    const path = createSlicePath(
                        RADIUS,
                        RADIUS,
                        RADIUS,
                        startAngle,
                        endAngle
                    );

                    const { x, y } = polarToCartesian(
                        RADIUS,
                        RADIUS,
                        RADIUS * 0.65,
                        middleAngle
                    );
                    console.log('middleAngle', middleAngle);

                    // Tính góc xoay để chữ song song bán kính
                    const rotationAngle = middleAngle - 90;

                    return (
                        <G key={index}>
                            <Path d={path} fill={slice.color} />

                            {/* Text */}
                            <Text
                                x={x}
                                y={y}
                                fontSize={16}
                                fontWeight="bold"
                                fill="#000"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                transform={`rotate(${rotationAngle} ${x} ${y})`} // xoay theo radial
                            >
                                {slice.label}
                            </Text>
                        </G>
                    );
                })}

                {/* 2️⃣ Divider lines */}
                {Array.from({ length: slices.length }).map((_, i) => {
                    const { x, y } = polarToCartesian(
                        RADIUS,
                        RADIUS,
                        RADIUS,
                        i * anglePerSlice
                    );

                    return (
                        <Line
                            key={i}
                            x1={RADIUS}
                            y1={RADIUS}
                            x2={x}
                            y2={y}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                        />
                    );
                })}

                {/* 3️⃣ Outer circle (TRÒN TUYỆT ĐỐI) */}
                <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={RADIUS - 1}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    fill="none"
                />
            </G>
        </Svg>
    );
};
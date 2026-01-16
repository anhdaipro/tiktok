import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Mask, Rect, Stop, SvgProps } from 'react-native-svg';

export type GradientStop = {
    offset: string;
    color: string;
};

export type CircleCutout = {
    position: 'left' | 'right' | 'top' | 'bottom';
    offset?: number; // Offset from edge (0-100%)
    radius?: number;
};

interface VoucherBackgroundProps {
    width: number;
    height: number;
    gradientColors?: GradientStop[];
    gradientDirection?: { x1: number; y1: number; x2: number; y2: number };
    circleCutouts?: CircleCutout[];
    borderRadius?: number;
    backgroundColor?: string; // Solid color fallback
    style?: SvgProps['style'];
}

export const VoucherBackground: React.FC<VoucherBackgroundProps> = ({
    width,
    height,
    gradientColors,
    gradientDirection = { x1: 0, y1: 0, x2: 1, y2: 1 },
    circleCutouts = [],
    borderRadius = 8,
    backgroundColor,
    style,
}) => {
    const uniqueId = `voucher-${Math.random().toString(36).substr(2, 9)}`;
    const gradientId = `gradient-${uniqueId}`;
    const maskId = `mask-${uniqueId}`;

    const hasGradient = gradientColors && gradientColors.length > 0;

    const getCirclePosition = (cutout: CircleCutout) => {
        const offset = cutout.offset || 50; // Default to middle
        const radius = cutout.radius || 6;

        switch (cutout.position) {
            case 'left':
                return { cx: 0, cy: (height * offset) / 100, r: radius };
            case 'right':
                return { cx: width, cy: (height * offset) / 100, r: radius };
            case 'top':
                return { cx: (width * offset) / 100, cy: 0, r: radius };
            case 'bottom':
                return { cx: (width * offset) / 100, cy: height, r: radius };
        }
    };

    return (
        <Svg
            width="100%"
            height="100%"
            style={[StyleSheet.absoluteFill, style]}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
        >
            <Defs>
                {hasGradient && (
                    <LinearGradient
                        id={gradientId}
                        x1={gradientDirection.x1}
                        y1={gradientDirection.y1}
                        x2={gradientDirection.x2}
                        y2={gradientDirection.y2}
                    >
                        {gradientColors.map((stop, index) => (
                            <Stop key={index} offset={stop.offset} stopColor={stop.color} />
                        ))}
                    </LinearGradient>
                )}
                {circleCutouts.length > 0 && (
                    <Mask id={maskId}>
                        <Rect x="0" y="0" width={width} height={height} fill="white" />
                        {circleCutouts.map((cutout, index) => {
                            const pos = getCirclePosition(cutout);
                            return <Circle key={index} {...pos} fill="black" />;
                        })}
                    </Mask>
                )}
            </Defs>
            <Rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill={hasGradient ? `url(#${gradientId})` : backgroundColor || '#2A2A2A'}
                mask={circleCutouts.length > 0 ? `url(#${maskId})` : undefined}
                rx={borderRadius}
            />
        </Svg>
    );
};

export default VoucherBackground;

# VoucherBackground Component

Reusable SVG component for creating voucher card backgrounds with gradient fills and circle cutouts.

## Features

- ✅ **Gradient Support** - Multi-stop linear gradients
- ✅ **Circle Cutouts** - Configurable position and size
- ✅ **Solid Colors** - Fallback to solid background
- ✅ **Border Radius** - Rounded corners
- ✅ **Flexible Sizing** - Any width/height
- ✅ **Unique IDs** - No conflicts when multiple instances

## Props

```typescript
interface VoucherBackgroundProps {
    width: number;                    // SVG width
    height: number;                   // SVG height
    gradientColors?: GradientStop[];  // Gradient color stops
    gradientDirection?: {             // Gradient direction
        x1: number; 
        y1: number; 
        x2: number; 
        y2: number;
    };
    circleCutouts?: CircleCutout[];   // Circle cutout positions
    borderRadius?: number;            // Corner radius (default: 8)
    backgroundColor?: string;         // Solid color fallback
    style?: SvgProps['style'];        // Additional styles
}
```

### GradientStop

```typescript
type GradientStop = {
    offset: string;  // e.g., "0%", "50%", "100%"
    color: string;   // Hex color
};
```

### CircleCutout

```typescript
type CircleCutout = {
    position: 'left' | 'right' | 'top' | 'bottom';
    offset?: number;  // Position along edge (0-100%, default: 50)
    radius?: number;  // Circle radius (default: 6)
};
```

## Usage Examples

### Example 1: Gradient with Side Cutouts

```tsx
<VoucherBackground
    width={300}
    height={100}
    gradientColors={[
        { offset: '0%', color: '#5A0F1F' },
        { offset: '50%', color: '#8B1538' },
        { offset: '100%', color: '#A01D3A' },
    ]}
    circleCutouts={[
        { position: 'left', offset: 50, radius: 5 },
        { position: 'right', offset: 50, radius: 5 },
    ]}
    borderRadius={8}
/>
```

### Example 2: Solid Color with Top/Bottom Cutouts

```tsx
<VoucherBackground
    width={400}
    height={140}
    backgroundColor="#2A2A2A"
    circleCutouts={[
        { position: 'top', offset: 30, radius: 6 },
        { position: 'bottom', offset: 30, radius: 6 },
    ]}
    borderRadius={12}
/>
```

### Example 3: Two-Color Gradient

```tsx
<VoucherBackground
    width={350}
    height={120}
    gradientColors={[
        { offset: '0%', color: '#8B1538' },
        { offset: '100%', color: '#C41E3A' },
    ]}
    circleCutouts={[
        { position: 'left', offset: 71.4, radius: 6 },
        { position: 'right', offset: 71.4, radius: 6 },
    ]}
/>
```

### Example 4: Custom Gradient Direction

```tsx
<VoucherBackground
    width={300}
    height={100}
    gradientColors={[
        { offset: '0%', color: '#FF6B6B' },
        { offset: '100%', color: '#4ECDC4' },
    ]}
    gradientDirection={{ x1: 0, y1: 0, x2: 0, y2: 1 }} // Vertical
    borderRadius={16}
/>
```

## Integration Examples

### In VoucherXtraCard

```tsx
<TouchableOpacity style={styles.container}>
    <VoucherBackground
        width={300}
        height={100}
        gradientColors={[
            { offset: '0%', color: '#5A0F1F' },
            { offset: '50%', color: '#8B1538' },
            { offset: '100%', color: '#A01D3A' },
        ]}
        circleCutouts={[
            { position: 'left', offset: 50, radius: 5 },
            { position: 'right', offset: 50, radius: 5 },
        ]}
        borderRadius={8}
    />
    <View style={styles.content}>
        {/* Your content here */}
    </View>
</TouchableOpacity>
```

### In VoucherCard

```tsx
<View style={styles.container}>
    <VoucherBackground
        width={400}
        height={140}
        gradientColors={
            variant === 'gradient'
                ? [
                      { offset: '0%', color: '#8B1538' },
                      { offset: '100%', color: '#C41E3A' },
                  ]
                : undefined
        }
        backgroundColor={variant === 'default' ? '#2A2A2A' : undefined}
        circleCutouts={[
            { position: 'left', offset: 71.4, radius: 6 },
            { position: 'right', offset: 71.4, radius: 6 },
        ]}
        borderRadius={12}
    />
    <View style={styles.content}>
        {/* Your content here */}
    </View>
</View>
```

## Circle Cutout Positioning

The `offset` prop determines where the circle appears along the edge:

```
position: 'left' or 'right'
  offset: 0   → Top edge
  offset: 50  → Middle (default)
  offset: 100 → Bottom edge

position: 'top' or 'bottom'
  offset: 0   → Left edge
  offset: 50  → Middle (default)
  offset: 100 → Right edge
```

## Tips

1. **Unique IDs**: Component automatically generates unique IDs for gradients and masks
2. **Absolute Fill**: Component uses `StyleSheet.absoluteFill` by default
3. **Preserve Aspect**: Uses `preserveAspectRatio="none"` for flexible scaling
4. **Gradient vs Solid**: Provide either `gradientColors` OR `backgroundColor`, not both

## Color Palettes

### Voucher Xtra (3-stop gradient)
```typescript
[
    { offset: '0%', color: '#5A0F1F' },
    { offset: '50%', color: '#8B1538' },
    { offset: '100%', color: '#A01D3A' },
]
```

### Standard Voucher (2-stop gradient)
```typescript
[
    { offset: '0%', color: '#8B1538' },
    { offset: '100%', color: '#C41E3A' },
]
```

### Dark Solid
```typescript
backgroundColor: '#2A2A2A'
```


import { useTheme } from "@/contexts/theme-context";
import React, { useMemo } from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Variant = "default" | "outline" | "ghost" | "primary";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  label?: string;
  loading?: boolean;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  loading,
  variant = "default",
  size = "md",
  disabled,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sizeStyles = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  }
  const variantStyles = {
    default: {},
    outline: {},
    primary: {
      backgroundColor: colors.primary
    },
    ghost: {},

  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && { opacity: 0.5 },
        style,
      ]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  base: {
    borderRadius: 12,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});
import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';

interface Props extends ViewProps {
  size: number;
  color: string;
  icon: ReactNode;
  children?: ReactNode;
}

const RoundedIcon: React.FC<Props> = ({
  children,
  size,
  color,
  icon,
  style,
  ...rest
}) => {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2, // Luôn là một nửa của size để tạo hình tròn
    backgroundColor: color,
  };

  return (
    <View style={[styles.container, containerStyle, style]} {...rest}>
      {icon}
      {children}
    </View>
  );
};

export default RoundedIcon;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
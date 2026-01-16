
import { useTheme } from '@/contexts/theme-context';
import { ChevronRight } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface MenuItemProps extends TouchableOpacityProps {
  icon: ReactNode;
  text: string;
  rightItem?: ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  rightItem,
  icon,
  text,
  style,
  ...rest
}) => {
  const {colors} = useTheme();
  const styles = themedStyles(colors);
  return(
  <TouchableOpacity style={[styles.menuItem, style]} {...rest}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={styles.menuText}>{text}</Text>
    </View>
    {rightItem || <ChevronRight  size={24} color={colors.textSecondary} />}
  </TouchableOpacity>
);
}

const themedStyles = (colors:any)  => StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:8,
  },
  menuText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default MenuItem;
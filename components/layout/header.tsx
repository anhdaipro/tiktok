
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';

interface Props extends ViewProps{
  title: string;
  onPress?: () => void
  itemRight?:ReactNode
}
const HeaderNavigate: React.FC<Props> = ({ title, itemRight, onPress,style }) => {
  const handlePress = onPress || (() => router.back());
  const router = useRouter();
  const {colors} = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity onPress={handlePress}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{minWidth:0, alignItems:'flex-end'}}>{itemRight}</View>
    </View>
  )
}
const createStyles = (colors:any) => StyleSheet.create({
  header: { 
      flexDirection: 'row',
      position: 'relative',
      justifyContent: 'space-between',
      alignItems: 'center', 
      height:52,
      marginHorizontal: 16, 
    },
    headerTitle: { 
      fontSize: 20, 
      fontWeight: '600',
      color: colors.text, 
    },
})
export default HeaderNavigate;
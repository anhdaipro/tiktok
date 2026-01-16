import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

const CustomAddButton = () => {
    const { colors } = useTheme();
    const styles  = createThemedStyles(colors);
  return (
    <View style={styles.addButtonContainer}>
      <View style={[styles.addButtonSide, styles.addButtonLeft]} />
      <View style={[styles.addButtonSide, styles.addButtonRight]} />
      <View style={styles.addButtonCenter}>
        <Plus size={20} color={colors.text} strokeWidth={2} />
      </View>
    </View>
  );
};
const createThemedStyles = (colors: any) => StyleSheet.create({
   // Style cho nút Plus (+)
  addButtonContainer: {
    width: 45,
    height: 30,
    marginTop: 12, // Căn chỉnh lại vị trí cho cân giữa dòng
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonSide: {
    position: 'absolute',
    width: 38,
    height: '100%',
    borderRadius: 8,
  },
  addButtonLeft: {
    backgroundColor: Colors.secondary, // Màu xanh TikTok (Cyan)
    left: 0,
  },
  addButtonRight: {
    backgroundColor: Colors.primary, // Màu đỏ TikTok
    right: 0,
  },
  addButtonCenter: {
    position: 'relative',
    width: 38,
    height: '100%',
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
});
export default CustomAddButton;
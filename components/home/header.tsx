import { Colors } from '@/constants/theme';
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FlexBox from '../common/flex-box';
const { width } = Dimensions.get('window');
const Header = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { top: insets.top }]}>
      <FlexBox align="center" direction='row' justify='space-between' style={{ width: '100%' }} gap={4}>
        {children}
        {/* Dummy view để cân đối layout, bây giờ nằm trong FlexBox */}

      </FlexBox>
    </View>)
}
const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    width: width,
    padding: 16,
    zIndex: 100,
  },
  tabTextInactive: {
    color: Colors.static.white,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  activeTabContainer: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  tabTextActive: {
    color: Colors.static.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  underline: {
    width: 30,
    height: 3,
    backgroundColor: Colors.static.white,
    marginTop: 4,
    borderRadius: 2,
  },
})
export default Header 
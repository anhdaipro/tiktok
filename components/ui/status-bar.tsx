import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface StatusBarCustomProps {
  bgColor?: string;
}

const StatusBarCustom: React.FC<StatusBarCustomProps> = ({ 
  bgColor,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ height: insets.top, backgroundColor: bgColor }} />
  )
}

export default StatusBarCustom
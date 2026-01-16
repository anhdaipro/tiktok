
import { useTheme } from '@/contexts/theme-context';
import { RefreshCcw } from 'lucide-react-native';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
interface Props{
    onRetry?: () => void;
    errorText?: string;
}
const ErrorComponent: React.FC<Props> = ({
    onRetry, 
    errorText,
}) =>{
  const {colors} = useTheme();
  const styles = createThemedStyles(colors);
  return (
    <View style={styles.container}>
        <Text style={styles.errorText}>{errorText || 'Không thể tải dữ liệu. Vui lòng kiểm tra lại kết nối.'}</Text>
        {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <RefreshCcw size={16} color={colors.text} />
            <Text style={styles.retryText}>Tải lại</Text>
        </TouchableOpacity>
        )}
    </View>
  )
}

export default memo(ErrorComponent);
const createThemedStyles = (colors: any) =>StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: { 
    textAlign: 'center', 
    color: colors.textSecondary, 
    marginTop: 16, 
    fontSize: 16, 
  },
  retryButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 24, 
    backgroundColor: colors.surface, 
    gap:8,
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 8 
  },
  retryText: { 
    color: colors.text, 
    textAlign: 'center',
    fontWeight: '600',
  },
});
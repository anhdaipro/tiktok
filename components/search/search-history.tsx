import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { ChevronDown, Clock, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchHistoryProps {
  items: string[];
  onRemoveItem: (index: number) => void;
  onPressItem: (item: string) => void;
}

export const SearchHistory = ({ items, onRemoveItem, onPressItem }: SearchHistoryProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {visibleItems.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.itemRow} 
          onPress={() => onPressItem(item)}
        >
          <FlexBox direction="row" align="center" gap={10} style={{ flex: 1 }}>
            <Clock size={16} color={colors.textSecondary} />
            <Text style={styles.itemText} numberOfLines={1}>{item}</Text>
          </FlexBox>
          <TouchableOpacity onPress={() => onRemoveItem(index)} hitSlop={10} style={{padding: 4}}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      {hasMore && !isExpanded && (
        <TouchableOpacity 
          style={styles.seeMoreContainer} 
          onPress={() => setIsExpanded(true)}
        >
          <Text style={styles.seeMoreText}>Xem thêm</Text>
          <ChevronDown size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  seeMoreText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
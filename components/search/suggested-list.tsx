import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { RotateCw } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SuggestedItem {
  id: string;
  text: string;
  image?: string;
  isHot?: boolean;
}

interface SuggestedListProps {
  items: SuggestedItem[];
  onPressItem: (item: SuggestedItem) => void;
}

export const SuggestedList = ({ items, onPressItem }: SuggestedListProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <FlexBox direction="row" justify="space-between" align="center" style={styles.header}>
        <Text style={styles.title}>Bạn có thể thích</Text>
        <TouchableOpacity style={styles.refreshBtn}>
            <RotateCw size={14} color={colors.textSecondary} />
            <Text style={styles.refreshText}>Làm mới</Text>
        </TouchableOpacity>
      </FlexBox>

      <View style={styles.list}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemRow} 
            onPress={() => onPressItem(item)}
          >
            <FlexBox direction="row" align="center" gap={12} style={{ flex: 1 }}>
              <View style={[styles.dot, index === 0 && styles.dotActive]} />
              <Text style={styles.itemText} numberOfLines={1}>{item.text}</Text>
            </FlexBox>
            
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            )}
            {item.isHot && (
                 <View style={styles.hotBadge}>
                    <Text style={styles.hotText}>Hot</Text>
                 </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  list: {
    
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
  },
  dotActive: {
    backgroundColor: '#FE2C55', 
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  itemImage: {
    width: 30,
    height: 40,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  hotBadge: {
    backgroundColor: '#FE2C55',
    paddingHorizontal: 4,
    borderRadius: 2,
    marginLeft: 8,
  },
  hotText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});
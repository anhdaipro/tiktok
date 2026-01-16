import { SearchHeader } from '@/components/search/search-header';
import { SearchHistory } from '@/components/search/search-history';
import { SuggestedList } from '@/components/search/suggested-list';
import StatusBarCustom from '@/components/ui/status-bar';
import { useTheme } from '@/contexts/theme-context';
import { Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MOCK_HISTORY = [
  'tại sao hà nội bị ô nhiễm không khí',
  'duy thẩm review ô nhiễm',
  'giọng amee nói chuyện',
  'cách làm mì trộn',
  'review phim mới',
];

const MOCK_SUGGESTED = [
  { id: '1', text: 'tìm hiểu nhật bản', image: 'https://i.imgur.com/gB44t2D.png' },
  { id: '2', text: 'mì trộn abc vị gà cay', image: 'https://i.imgur.com/dHy2fWw.png' },
  { id: '3', text: 'Tình Hình Biên Giới Thái Lan Vs Camp...', image: 'https://i.imgur.com/Yf2aG4A.png' },
  { id: '4', text: 'nhật bản đài loan', image: 'https://i.imgur.com/pSOV6O8.png' },
  { id: '5', text: 'mì trộn', image: 'https://i.imgur.com/3Y2mYnm.png' },
  { id: '6', text: 'mì phô mai', isHot: true },
];

const MOCK_AUTOCOMPLETE = [
  'hà nội',
  'hà nội hôm nay',
  'hà nội phố',
  'hà nội trà đá vỉa hè',
  'hà nội mùa thu',
  'nhật bản',
  'nhật bản du lịch',
  'nhật bản mùa lá đỏ',
  'mì trộn',
  'mì trộn muối ớt',
  'mì trộn trứng lòng đào',
];

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [searchText, setSearchText] = useState('');

  const handleRemoveHistory = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  const autocompleteData = useMemo(() => {
    if (!searchText) return [];
    return MOCK_AUTOCOMPLETE.filter(item => 
      item.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  return (
    <View style={styles.container}>
      <StatusBarCustom />
      <SearchHeader 
        onSearch={(text) => console.log('Search:', text)} 
        onChangeText={setSearchText}
      />
      
      <ScrollView 
        style={styles.content} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searchText ? (
          <View style={styles.autocompleteList}>
            {autocompleteData.map((item, index) => (
              <TouchableOpacity key={index} style={styles.autocompleteItem} onPress={() => console.log('Select autocomplete:', item)}>
                <Search size={16} color={colors.textSecondary} />
                <Text style={styles.autocompleteText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.spacer} />
            
            <SearchHistory 
              items={history} 
              onRemoveItem={handleRemoveHistory}
              onPressItem={(item) => console.log('Press history:', item)}
            />
            
            <View style={styles.divider} />
            
            <SuggestedList 
              items={MOCK_SUGGESTED} 
              onPressItem={(item) => console.log('Press suggested:', item.text)}
            />
          </>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 8,
  },
  divider: {
    height: 8,
    backgroundColor: colors.backgroundSecondary || '#F1F1F2',
  },
  autocompleteList: {
    paddingHorizontal: 16,
  },
  autocompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  autocompleteText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
});

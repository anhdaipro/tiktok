import { Colors } from '@/constants/theme';
import { useBottomSheet } from '@/contexts/bottom-sheet-context';
import useSound from '@/hooks/use-music-player';
import { useUploadStore } from '@/stores/upload-store';
import { Bookmark, Scissors, Search, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedBar from '../common/animation-bar';
import FlexBox from '../common/flex-box';
import { MusicTrack } from './camera-record';
// Mock data nhạc
const MOCK_MUSIC = [
  { id: '1', title: 'Vợ Người Ta La La La', author: 'MAI CÔNG DANH', duration: 42, url: "https://a128-z3.zmdcdn.me/297aabde87fe24a0c4aee7e08264f466?authen=exp=1766823269~acl=/297aabde87fe24a0c4aee7e08264f466*~hmac=cf03cf9d1c790e8e842f611269f56add", cover: 'https://i.imgur.com/dHy2fWw.png' },
  { id: '2', title: 'Năng Lượng Tích Cực', author: 'MeMe Media', duration: 60, url: 'https://preview-z3.zmdcdn.me/34ff065cfc4fa01758c4c6ea089e4dc2?authen=exp=1766028667~acl=/34ff065cfc4fa01758c4c6ea089e4dc2*~hmac=b5f2b3a6143a2c04b283110c427d679c', cover: 'https://i.imgur.com/3Y2mYnm.png' },
  { id: '3', title: 'CHANEL', author: 'Tyla', duration: 22, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: 'https://i.imgur.com/gB44t2D.png' },
  { id: '4', title: 'SLAY!', author: 'Eternxlkz', duration: 29, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: 'https://i.imgur.com/Yf2aG4A.png' },
  { id: '5', title: 'NGƯỜI YÊU CHƯA SINH RA', author: 'ANH TRAI "SAY HI"', duration: 60, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://i.imgur.com/pSOV6O8.png' },
  { id: '6', title: 'GIẤC MƠ', author: 'MiQ & Catchellers', duration: 60, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://i.imgur.com/3Y2mYnm.png' },
];
interface MusicSheetProps {
  setAppActive: (active: boolean) => void
}
const MusicSheet: React.FC<MusicSheetProps> = ({
  setAppActive
}) => {
  const { isPlaying, handlePlay } = useSound();
  console.log('isPlaying', isPlaying);
  const { hideBottomSheet } = useBottomSheet();
  const music = useUploadStore((state) => state.music);
  const handleSelect = (track: MusicTrack) => {
    handlePlay(track);
  }
  React.useEffect(() => {
    return () => {
      setAppActive(true);
    };
  }, []);

  return (
    <View style={styles.modalContainer}>
      {/* Modal Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={hideBottomSheet} style={{ padding: 4 }}>
          <X size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.gray500} />
          <TextInput
            placeholder="Tìm kiếm bài hát, nghệ sĩ..."
            style={styles.searchInput}
            placeholderTextColor={Colors.gray500}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Text style={[styles.tabText, styles.activeTab]}>Gợi ý</Text>
        <Text style={styles.tabText}>Yêu thích</Text>
        <Text style={styles.tabText}>Gần đây</Text>
      </View>

      <FlatList
        data={MOCK_MUSIC}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.musicItem}
            onPress={() => handleSelect(item)}
          >
            <Image source={{ uri: item.cover }} style={[styles.musicCover, isPlaying && item.id === music?.id && { borderColor: Colors.primary, borderWidth: 2 }]} />
            <View style={styles.musicInfo}>
              <FlexBox direction="row" align='baseline' gap={8}>
                {isPlaying && item.id === music?.id && <FlexBox direction="row" align='flex-end' gap={2}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <AnimatedBar key={i} maxHeight={16} />
                  ))}</FlexBox>}
                <Text style={[styles.musicTitle, isPlaying && item.id === music?.id && { color: Colors.primary }]}>{item.title}</Text>
              </FlexBox>
              <Text style={styles.musicAuthor}>{item.author}</Text>
              <Text style={styles.musicDuration}>{item.duration}s</Text>
            </View>

            <View style={styles.musicActions}>
              <TouchableOpacity style={{ marginRight: 16 }}>
                <Scissors size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Bookmark size={20} color={Colors.gray300} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
export default MusicSheet;
const styles = StyleSheet.create({
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: 'white' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F1F2', borderRadius: 4, paddingHorizontal: 12, height: 36 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: 'black' },

  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 16 },
  tabText: { fontSize: 15, fontWeight: '600', color: '#888', marginRight: 24, paddingBottom: 12 },
  activeTab: { color: 'black', borderBottomWidth: 2, borderBottomColor: 'black' },

  musicItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  musicCover: { width: 64, height: 64, borderRadius: 4, backgroundColor: '#eee' },
  musicInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  musicTitle: { fontWeight: '600', fontSize: 15, marginBottom: 4 },
  musicAuthor: { color: '#888', fontSize: 13, marginBottom: 4 },
  musicDuration: { color: '#888', fontSize: 12 },
  musicActions: { flexDirection: 'row', alignItems: 'center' },
});
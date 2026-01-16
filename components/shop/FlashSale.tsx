import { CountdownTimer } from '@/components/common/countdown-timer';
import FlexBox from '@/components/common/flex-box';
import { Colors } from '@/constants/theme';
import { Image } from "expo-image";
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
const MOCK_FLASH_SALE = [
  { id: '1', image: 'https://i.imgur.com/gB44t2D.png', price: 1, soldPercent: 57 },
  { id: '2', image: 'https://i.imgur.com/dHy2fWw.png', price: 28000, soldPercent: 93 },
  { id: '3', image: 'https://i.imgur.com/Yf2aG4A.png', price: 12000, soldPercent: 71 },
  { id: '4', image: 'https://i.imgur.com/pSOV6O8.png', price: 1000, soldPercent: 46 },
];

const FlashSaleCard = ({ item }: { item: any }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <Text style={styles.cardPrice}>{item.price.toLocaleString()}đ</Text>
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${item.soldPercent}%` }]} />
      <Text style={styles.progressText}>{item.soldPercent}%</Text>
    </View>
  </View>
);

export const FlashSale = () => {
  // Giả lập thời gian kết thúc (ví dụ: 2 giờ 30 phút từ bây giờ)
  const targetDate = new Date().getTime() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000;

  return (
    <View style={styles.container}>
      <FlexBox direction="row" justify="space-between" align="center">
        <Text style={styles.title}>Flash Sale</Text>
        <CountdownTimer targetDate={targetDate} />
      </FlexBox>
      <FlatList
        data={MOCK_FLASH_SALE}
        renderItem={({ item }) => <FlashSaleCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, marginTop: 12 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', padding: 12, borderRadius: 12, margin: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, fontStyle: 'italic' },
  card: { width: 100 },
  cardImage: { width: '100%', height: 100, borderRadius: 8, backgroundColor: '#f0f0f0' },
  cardPrice: { fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  progressContainer: {
    height: 16,
    backgroundColor: '#FEEBEF',
    borderRadius: 8,
    marginTop: 4,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    position: 'absolute',
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
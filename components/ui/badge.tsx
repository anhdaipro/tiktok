import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Badge = ({ count }: { count: number }) => {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { backgroundColor: '#FE2C55', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 18, alignItems: 'center', justifyContent: 'center' },
  text: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});
import FlexBox from '@/components/common/flex-box';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CountdownTimerProps {
  targetDate: number; // Timestamp đích đến
}

const CountdownBox = ({ value }: { value: string }) => (
  <View style={styles.countdownBox}>
    <Text style={styles.countdownText}>{value}</Text>
  </View>
);

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        return { hours: '00', minutes: '00', seconds: '00' };
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return {
        hours: hours < 10 ? `0${hours}` : `${hours}`,
        minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
      };
    };

    // Cập nhật ngay lập tức
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <FlexBox direction="row" align="center" gap={4}>
      <CountdownBox value={timeLeft.hours} />
      <Text style={styles.countdownSeparator}>:</Text>
      <CountdownBox value={timeLeft.minutes} />
      <Text style={styles.countdownSeparator}>:</Text>
      <CountdownBox value={timeLeft.seconds} />
    </FlexBox>
  );
};

const styles = StyleSheet.create({
  countdownBox: { backgroundColor: '#333', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  countdownText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  countdownSeparator: { color: '#333', fontWeight: 'bold' },
});
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
export function useFPS() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrame = useRef<number | null>(null);

  const measureFPS = (now: number) => {
    frameCount.current++;
    const delta = now - lastTime.current;

    // Mỗi 1000ms thì cập nhật FPS
    if (delta >= 1000) {
      const currentFps = (frameCount.current * 1000) / delta;
      setFps(Math.round(currentFps));
      frameCount.current = 0;
      lastTime.current = now;
    }

    animationFrame.current = requestAnimationFrame(measureFPS);
  };

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(measureFPS);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return fps;
}
export default function FPSDisplay() {
  const fps = useFPS();
  return (
    <View
      style={{
        position: 'absolute',
        top: 40,
        right: 10,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 6,
        borderRadius: 6,
      }}
    >
      <Text style={{ color: '#0f0', fontWeight: 'bold' }}>FPS: {fps}</Text>
    </View>
  );
}
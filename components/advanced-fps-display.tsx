import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

export default function AdvancedFPSDisplay() {
    const [fps, setFps] = useState(0);
    const [avgFps, setAvgFps] = useState(0);
    const [minFps, setMinFps] = useState(60);
    const frameCount = useRef(0);
    const fpsHistory = useRef<number[]>([]);
    const lastTime = useRef(performance.now());

    const measureFPS = (now: number) => {
        frameCount.current++;
        const delta = now - lastTime.current;

        if (delta >= 1000) {
            const currentFps = Math.round((frameCount.current * 1000) / delta);
            setFps(currentFps);

            // Track history
            fpsHistory.current.push(currentFps);
            if (fpsHistory.current.length > 10) {
                fpsHistory.current.shift();
            }

            // Calculate average
            const avg = Math.round(
                fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
            );
            setAvgFps(avg);

            // Track minimum
            setMinFps(Math.min(minFps, currentFps));

            frameCount.current = 0;
            lastTime.current = now;
        }

        requestAnimationFrame(measureFPS);
    };

    useEffect(() => {
        requestAnimationFrame(measureFPS);
    }, []);

    const getColor = (fps: number) => {
        if (fps >= 55) return '#0f0'; // Green
        if (fps >= 45) return '#ff0'; // Yellow
        return '#f00'; // Red
    };

    return (
        <View
            style={{
                position: 'absolute',
                top: 40,
                right: 10,
                zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 8,
                borderRadius: 8,
            }}
        >
            <Text style={{ color: getColor(fps), fontWeight: 'bold', fontSize: 12 }}>
                FPS: {fps}
            </Text>
            <Text style={{ color: '#aaa', fontSize: 10 }}>Avg: {avgFps}</Text>
            <Text style={{ color: '#aaa', fontSize: 10 }}>Min: {minFps}</Text>
        </View>
    );
}

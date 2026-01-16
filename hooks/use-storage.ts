// hooks/useStorageManager.ts
import StorageManager from '@/native-modules/storage';
import { useCallback, useMemo, useState } from 'react';


export type StorageStats = Awaited<
    ReturnType<typeof StorageManager.getStorageStats>
>;

export function useStorageManager() {
    const [stats, setStats] = useState<StorageStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load storage info
    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await StorageManager.getStorageStats();
            setStats(res);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear app cache
    const clearCache = useCallback(async () => {
        try {
            setClearing(true);
            await StorageManager.clearCache();
            await refresh(); // reload stats after clear
            return true;
        } catch (e: any) {
            setError(e);
            return false;
        } finally {
            setClearing(false);
        }
    }, [refresh]);

    // Cleanup Downloads
    const clearDownloads = useCallback(async () => {
        try {
            setClearing(true);
            await StorageManager.clearDownloads();
            await refresh(); // reload stats after clear
            return true;
        } catch (e: any) {
            setError(e);
            return false;
        } finally {
            setClearing(false);
        }
    }, [refresh]);

    // % dung lượng app chiếm
    const appUsagePercentage = useMemo(() => {
        if (!stats) return 0;
        return (stats.appTotal / stats.systemTotal) * 100;
    }, [stats]);


    return {
        stats,
        loading,
        clearing,
        error,
        refresh,
        clearCache,
        clearDownloads,
        appUsagePercentage,
    };
}

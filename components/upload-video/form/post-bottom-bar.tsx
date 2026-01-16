import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PostBottomBar({ onPublish, isUploading }: { onPublish: () => void, isUploading: boolean }) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <View style={styles.bottomBar}>
             <Button size='lg' style={styles.draftBtn} variant="outline">
                 <Text style={styles.draftText}>Nháp</Text>
             </Button>
             <Button size='lg' style={styles.postBtn} onPress={onPublish} disabled={isUploading}>
                 {isUploading ? <Text style={styles.postText}>Đang đăng...</Text> : <Text style={styles.postText}>Đăng</Text>}
             </Button>
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
  bottomBar: { flexDirection: 'row', padding: 16, borderTopWidth: 0.5, borderColor: colors.border, gap: 12 },
  draftBtn: { flex: 1, 
    backgroundColor: colors.surface 
  },
  draftText: { 
    color: colors.text, 
    fontWeight: '600' 
  },
  postBtn: { 
    flex: 1, 
    backgroundColor: colors.primary, 
  },
  postText: { 
    color: '#fff', 
    fontWeight: '600' },
});

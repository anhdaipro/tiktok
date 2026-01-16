import FlexBox from '@/components/common/flex-box';
import { useTheme } from '@/contexts/theme-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const insets = useSafeAreaInsets();
    return (
        
        <View style={[styles.container, { top: insets.top }]}>
            <FlexBox direction="row" align="center" gap={12}>
                <TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
                    <ArrowLeft size={24} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/search')} style={{flex:1}}>
                    <FlexBox direction="row" align="center" gap={12} style={styles.innerContainer}>
                        <FlexBox style={styles.searchBar} direction="row" align="center" gap={8}>
                            <Search size={20} color={colors.white} />
                            <Text style={styles.searchText}>Tìm kiếm nội dung liên quan</Text>
                        </FlexBox>
                        <View style={styles.viewSearch}>
                            <Text style={styles.searchText}>Tìm kiếm</Text>
                        </View>
                    </FlexBox>
                </TouchableOpacity>
            </FlexBox>
        </View>
    );
};

export default Header;

const createStyles = (colors: any) => StyleSheet.create({
    buttonBack: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        position:'absolute',
        
        left: 0,
        width: '100%',
        zIndex: 10,
    },
    searchBar: {
       flex:1,
        borderRightWidth: 1,
        borderColor: colors.border,
    },
    viewSearch: {
       
    },
    searchText: {
        color: colors.textSecondary,
        fontSize: 14,
    },

    searchButton: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    innerContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 16,
       
    },
});
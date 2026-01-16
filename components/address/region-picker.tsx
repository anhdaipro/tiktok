import { useTheme } from '@/contexts/theme-context';
import { Check, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock Data
const DATA: Record<string, Record<string, string[]>> = {
    'Hồ Chí Minh': {
        'Bình Thạnh': ['Phường 17', 'Phường 25', 'Phường 1', 'Phường 2', 'Phường 3'],
        'Quận 1': ['Bến Nghé', 'Bến Thành', 'Đa Kao', 'Tân Định'],
        'Thủ Đức': ['Linh Trung', 'Linh Chiểu', 'Bình Thọ'],
    },
    'Hà Nội': {
        'Ba Đình': ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc'],
        'Hoàn Kiếm': ['Phan Chu Trinh', 'Hàng Bài', 'Hàng Bạc'],
        'Cầu Giấy': ['Dịch Vọng', 'Mai Dịch', 'Yên Hòa'],
    },
    'Bình Phước': {
        'Đồng Xoài': ['Tân Phú', 'Tân Bình', 'Tiến Thành'],
        'Tân Lập': ['Xã Tân Lập'],
    },
    'Đà Nẵng': {
        'Hải Châu': ['Hải Châu 1', 'Hải Châu 2', 'Thạch Thang'],
        'Thanh Khê': ['Vĩnh Trung', 'Tân Chính', 'Thạc Gián'],
    }
};

type Step = 'city' | 'district' | 'ward';

interface RegionPickerProps {
    onSelect: (result: string) => void;
    onClose: () => void;
}

export const RegionPicker = ({ onSelect, onClose }: RegionPickerProps) => {
    const { colors } = useTheme();
    const [step, setStep] = useState<Step>('city');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

    const handleSelect = (item: string) => {
        if (step === 'city') {
            setSelectedCity(item);
            setStep('district');
        } else if (step === 'district') {
            setSelectedDistrict(item);
            setStep('ward');
        } else {
            // Ward selected
            const fullAddress = `${item}, ${selectedDistrict}, ${selectedCity}`;
            onSelect(fullAddress);
            onClose();
        }
    };

    const handleTabPress = (targetStep: Step) => {
        if (targetStep === 'city') {
            setStep('city');
            setSelectedDistrict(null);
        } else if (targetStep === 'district' && selectedCity) {
            setStep('district');
        }
    };

    const currentList = useMemo(() => {
        if (step === 'city') return Object.keys(DATA);
        if (step === 'district' && selectedCity) return Object.keys(DATA[selectedCity]);
        if (step === 'ward' && selectedCity && selectedDistrict) {
             return DATA[selectedCity][selectedDistrict] || [];
        }
        return [];
    }, [step, selectedCity, selectedDistrict]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Địa chỉ nhận hàng</Text>
                <TouchableOpacity onPress={onClose}>
                    <X size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => handleTabPress('city')} style={[styles.tab, step === 'city' && styles.activeTab]}>
                    <Text style={[styles.tabText, step === 'city' ? { color: colors.primary } : { color: colors.text }]}>
                        {selectedCity || 'Tỉnh/Thành phố'}
                    </Text>
                </TouchableOpacity>
                
                {(selectedCity || step === 'district' || step === 'ward') && (
                     <TouchableOpacity onPress={() => handleTabPress('district')} style={[styles.tab, step === 'district' && styles.activeTab]}>
                        <Text style={[styles.tabText, step === 'district' ? { color: colors.primary } : { color: colors.text }]}>
                            {selectedDistrict || 'Quận/Huyện'}
                        </Text>
                    </TouchableOpacity>
                )}

                {(selectedDistrict || step === 'ward') && (
                     <TouchableOpacity style={[styles.tab, step === 'ward' && styles.activeTab]}>
                        <Text style={[styles.tabText, step === 'ward' ? { color: colors.primary } : { color: colors.text }]}>
                            Phường/Xã
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.list}>
                {currentList.map((item) => {
                    const isSelected = item === selectedCity || item === selectedDistrict;
                    return (
                        <TouchableOpacity 
                            key={item} 
                            style={[styles.item, { borderBottomColor: colors.border }]} 
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={[styles.itemText, { color: isSelected ? colors.primary : colors.text }]}>{item}</Text>
                            {isSelected && <Check size={18} color={colors.primary} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 500,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
    },
    tab: {
        marginRight: 24,
        paddingBottom: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FE2C55',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
    },
    itemText: {
        fontSize: 14,
    }
});

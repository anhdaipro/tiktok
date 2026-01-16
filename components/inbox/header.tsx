import FlexBox from '@/components/common/flex-box';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
const Header = () => (
    <FlexBox direction="row" justify="space-between" align="center" style={{ padding: 16, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: '#eee' }}>
      <View style={{ width: 24 }} />
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Hộp thư</Text>
      </View>
      
      <FlexBox gap={16} direction="row">
         <Search size={24} color="#333" />
      </FlexBox>
    </FlexBox>
  );
  export default Header;
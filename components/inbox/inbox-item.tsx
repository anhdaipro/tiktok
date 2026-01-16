import { FormatHelper } from '@/common/helpers/format';
import FlexBox from '@/components/common/flex-box';
import { IconBox } from '@/components/common/icon-box';
import { Badge } from '@/components/ui/badge';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const InboxRow = ({ item }: { item: any }) => {
  const isSystem = item.type === 'system';

  return (
    <TouchableOpacity>
      <FlexBox direction="row" align="center" gap={12} style={{ padding: 12, backgroundColor: 'white' }}>
        {isSystem ? (
          <IconBox icon={item.icon} color={item.color} />
        ) : (
          <Image source={{ uri: item.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
        )}

        <FlexBox flex={1} justify="center" gap={4}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.title || 'No title'}</Text>
          <Text style={{ color: '#666', fontSize: 13 }} numberOfLines={1}>{item.content}</Text>
        </FlexBox>

        <FlexBox align="flex-end" gap={4}>
          {item.time ? <Text style={{ color: '#999', fontSize: 12 }}>{FormatHelper.formatDateTime(item.time)}</Text> : null}
          {item.badge ? <Badge count={item.badge} /> : null}
        </FlexBox>
      </FlexBox>
    </TouchableOpacity>
  );
};
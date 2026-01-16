import { Activity, MessageSquare, Users } from 'lucide-react-native'; // Cài lucide-react-native
import React from 'react';
import { View } from 'react-native';

export const IconBox = ({ icon, color, size = 48 }: { icon: string; color: string; size?: number }) => {
  const IconMap: any = { users: Users, activity: Activity, system: MessageSquare };
  const IconComponent = IconMap[icon] || MessageSquare;
  
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <IconComponent color="white" size={size * 0.5} />
    </View>
  );
};
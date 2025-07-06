import { View, TouchableOpacity } from 'react-native';
import { ArrowLeft } from '@tamagui/lucide-icons';
import { H3 } from 'tamagui';

interface AttendanceHeaderProps {
  title: string;
  onBack: () => void;
}

export function AttendanceHeader({ title, onBack }: AttendanceHeaderProps) {
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      marginBottom: 16 
    }}>
      <TouchableOpacity onPress={onBack}>
        <View style={{ 
          width: 40, 
          height: 40, 
          justifyContent: 'center', 
          alignItems: 'center',
          marginRight: 16
        }}>
          <ArrowLeft size={24} color="$color" />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <H3 color="$color" style={{ fontSize: 20, fontWeight: 'bold' }}>
          {title}
        </H3>
      </View>
    </View>
  );
}
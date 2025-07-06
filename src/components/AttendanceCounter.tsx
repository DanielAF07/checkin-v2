import { View } from 'react-native';
import { H3, Paragraph } from 'tamagui';

interface AttendanceCounterProps {
  attendanceCount: number;
  totalAttendees: number;
}

export function AttendanceCounter({ attendanceCount, totalAttendees }: AttendanceCounterProps) {
  return (
    <View style={{ 
      backgroundColor: '$blue2',
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center'
    }}>
      <H3 color="$blue11" style={{ fontSize: 24, fontWeight: 'bold' }}>
        {attendanceCount} / {totalAttendees}
      </H3>
      <Paragraph color="$blue10" style={{ fontSize: 16 }}>
        miembros presentes
      </Paragraph>
    </View>
  );
}
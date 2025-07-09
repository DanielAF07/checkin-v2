import { H3, Paragraph, YStack } from 'tamagui';

interface AttendanceCounterProps {
  attendanceCount: number;
  totalAttendees: number;
}

export function AttendanceCounter({
  attendanceCount,
  totalAttendees,
}: AttendanceCounterProps) {
  return (
    <YStack
      bg="$blue3"
      justify="center"
      items="center"
      py={8}
      px={16}
      rounded={12}
      mb={8}
    >
      <H3 color="$blue11" mb={-6} style={{ fontSize: 24, fontWeight: 'bold' }}>
        {attendanceCount} / {totalAttendees}
      </H3>
      <Paragraph color="$blue10" style={{ fontSize: 16 }}>
        miembros presentes
      </Paragraph>
    </YStack>
  );
}

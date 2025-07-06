import { View } from '@tamagui/core';
import { Card, H4, Paragraph } from 'tamagui';
import { type EventWithStats } from '../../store/attendanceStore';

interface EventCardProps {
  event: EventWithStats;
  onPress: () => void;
  formatDate: (dateString: string) => string;
}

export function EventCard({ event, onPress, formatDate }: EventCardProps) {
  return (
    <Card
      elevate
      size="$3"
      bordered
      marginBottom="$3"
      py="$3"
      px="$3"
      backgroundColor="$background"
      borderColor="$borderColor"
      pressStyle={{ scale: 0.98 }}
      onPress={onPress}
    >
      <View>
        <H4 color="$color">{formatDate(event.date)}</H4>
      </View>
      <Card.Footer>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Paragraph size="$4" color="$green10">
            {event.attendanceCount}
          </Paragraph>
          <Paragraph size="$4" color="$color">
            / {event.totalAttendees} miembros
          </Paragraph>
        </View>
      </Card.Footer>
    </Card>
  );
}

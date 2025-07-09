import type { EventWithAttendancesQuery } from '@/src/services';
import { View } from '@tamagui/core';
import { Card, H4, H6, Paragraph, YStack } from 'tamagui';

// Tipo para un evento individual con asistencias
type EventWithAttendances = NonNullable<
  EventWithAttendancesQuery['data']
>['events'][0];

interface EventCardProps {
  event: EventWithAttendances;
  totalAttendees?: number;
  onPress: () => void;
}

export function EventCard({
  event,
  onPress,
  totalAttendees = 0,
}: EventCardProps) {
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
      <YStack>
        <H4 color="$color">{event.name}</H4>
        <H6 size="$1" color="$color10" mt="$1">
          {new Date(event.date)
            .toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
            .replace(',', '')}
        </H6>
      </YStack>
      <Card.Footer>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Paragraph size="$4" color="$green10">
            {event.attendances.length}
          </Paragraph>
          <Paragraph size="$4" color="$color">
            / {totalAttendees} miembros
          </Paragraph>
        </View>
      </Card.Footer>
    </Card>
  );
}

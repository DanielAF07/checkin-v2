import { CalendarCheck, History } from '@tamagui/lucide-icons';
import { Button, Text, XStack } from 'tamagui';

export type EventFilterType = 'upcoming' | 'past';

interface EventsFilterProps {
  selectedFilter: EventFilterType;
  onFilterChange: (filter: EventFilterType) => void;
  upcomingCount: number;
  pastCount: number;
}

export function EventsFilter({
  selectedFilter,
  onFilterChange,
  upcomingCount,
  pastCount,
}: EventsFilterProps) {
  return (
    <XStack gap="$3" mb="$3" mx="$1">
      <Button
        size="$4"
        variant={selectedFilter === 'upcoming' ? undefined : 'outlined'}
        bg={selectedFilter === 'upcoming' ? '$green8' : 'transparent'}
        color={selectedFilter === 'upcoming' ? 'white' : '$color'}
        borderColor={selectedFilter === 'upcoming' ? '$green8' : '$borderColor'}
        onPress={() => onFilterChange('upcoming')}
        icon={CalendarCheck}
        flex={1}
      >
        <Text fontSize="$3" fontWeight="500">
          Próximos ({upcomingCount})
        </Text>
      </Button>

      <Button
        size="$4"
        variant={selectedFilter === 'past' ? undefined : 'outlined'}
        bg={selectedFilter === 'past' ? '$yellow8' : 'transparent'}
        color={selectedFilter === 'past' ? 'white' : '$color'}
        borderColor={selectedFilter === 'past' ? '$yellow8' : '$borderColor'}
        onPress={() => onFilterChange('past')}
        icon={History}
        flex={1}
      >
        <Text fontSize="$3" fontWeight="500">
          Pasados ({pastCount})
        </Text>
      </Button>
    </XStack>
  );
}
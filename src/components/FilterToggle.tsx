import { Check, UserPlus, Users } from '@tamagui/lucide-icons';
import { Button, Text, XStack } from 'tamagui';

export type FilterType = 'all' | 'present' | 'no-piime';

interface FilterToggleProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  noPiimeCount: number;
}

export function FilterToggle({
  selectedFilter,
  onFilterChange,
  noPiimeCount,
}: FilterToggleProps) {
  return (
    <XStack gap="$2" mb="$3">
      <Button
        size="$3"
        variant={selectedFilter === 'all' ? undefined : 'outlined'}
        bg={selectedFilter === 'all' ? '$blue8' : 'transparent'}
        color={selectedFilter === 'all' ? 'white' : '$color'}
        borderColor={selectedFilter === 'all' ? '$blue8' : '$borderColor'}
        onPress={() => onFilterChange('all')}
        icon={Users}
        flex={1}
      >
        <Text>Todos</Text>
      </Button>

      <Button
        size="$3"
        variant={selectedFilter === 'present' ? undefined : 'outlined'}
        bg={selectedFilter === 'present' ? '$green8' : 'transparent'}
        color={selectedFilter === 'present' ? 'white' : '$color'}
        borderColor={selectedFilter === 'present' ? '$green8' : '$borderColor'}
        onPress={() => onFilterChange('present')}
        icon={Check}
        flex={1}
      >
        <Text>Presentes</Text>
      </Button>

      <Button
        size="$3"
        variant={selectedFilter === 'no-piime' ? undefined : 'outlined'}
        bg={selectedFilter === 'no-piime' ? '$yellow8' : 'transparent'}
        color={selectedFilter === 'no-piime' ? 'white' : '$color'}
        borderColor={
          selectedFilter === 'no-piime' ? '$yellow8' : '$borderColor'
        }
        onPress={() => onFilterChange('no-piime')}
        icon={UserPlus}
        flex={1}
      >
        <Text>Nuevos ({noPiimeCount})</Text>
      </Button>
    </XStack>
  );
}

import { Plus } from '@tamagui/lucide-icons';
import { View } from 'react-native';
import { Button, H3 } from 'tamagui';

interface HomeHeaderProps {
  onCreateNew: () => void;
}

export function HomeHeader({ onCreateNew }: HomeHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <H3
        color="$color"
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        Domingos
      </H3>
      <Button
        size="$3"
        icon={Plus}
        onPress={onCreateNew}
        backgroundColor="transparent"
        borderColor="$borderColor"
        borderWidth={1}
        color="$color"
        pressStyle={{
          backgroundColor: '$color2',
          scale: 0.95,
        }}
        style={{
          minWidth: 40,
          minHeight: 40,
        }}
      />
    </View>
  );
}

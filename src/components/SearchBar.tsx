import { Search, X } from '@tamagui/lucide-icons';
import { Button, Input, XStack } from 'tamagui';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar persona...',
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <XStack
      items="center"
      bg="$black2"
      borderColor="$borderColor"
      borderWidth={1}
      rounded="$4"
      px="$3"
      mb="$4"
      gap="$2"
    >
      <Search size={20} color="$color" />

      <Input
        flex={1}
        borderWidth={0}
        background="transparent"
        color="$color"
        fontSize="$4"
        placeholder={placeholder}
        placeholderTextColor="$placeholderColor"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <Button
          size="$2"
          circular
          icon={X}
          onPress={handleClear}
          background="transparent"
          color="$color"
          pressStyle={{ scale: 0.9 }}
        />
      )}
    </XStack>
  );
}

import { useState } from 'react';
import { View } from 'react-native';
import { Search, X } from '@tamagui/lucide-icons';
import { Input, Button, XStack } from 'tamagui';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Buscar persona..." }: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <XStack 
      alignItems="center" 
      backgroundColor="$background" 
      borderColor="$borderColor" 
      borderWidth={1} 
      borderRadius="$4" 
      paddingHorizontal="$3" 
      marginBottom="$4"
      gap="$2"
    >
      <Search size={20} color="$color" />
      
      <Input
        flex={1}
        borderWidth={0}
        backgroundColor="transparent"
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
          backgroundColor="transparent"
          color="$color"
          pressStyle={{ scale: 0.9 }}
        />
      )}
    </XStack>
  );
}
import { eventsService } from '@/src/services';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, H4, Label, Text, XStack, YStack } from 'tamagui';
import { BottomSheet } from './ui/BottomSheet';
import { BottomSheetInput } from './ui/BottomSheetInput';

interface CreateEventBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
}

export function CreateEventBottomSheet({
  isOpen,
  onClose,
  onEventCreated,
}: CreateEventBottomSheetProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar formulario cuando se cierra el BottomSheet
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDate(new Date());
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleCreateEvent = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el evento');
      return;
    }

    setIsLoading(true);
    try {
      await eventsService.create({
        name: name.trim(),
        date: date.getTime(),
      });

      onClose();
      onEventCreated?.();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'No se pudo crear el evento. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BottomSheet
        open={isOpen}
        onClose={() => onClose()}
        snapPoints={['40%']}
        enablePanDownToClose
        dismissKeyboardOnTap
        resetOnKeyboardHide
      >
        <YStack gap="$4" width={'100%'} pt="$3" px="$4">
          <H4 text="center">Crear Nuevo Evento</H4>

          <YStack gap="$2">
            <Label htmlFor="event-name">Nombre del evento</Label>
            <BottomSheetInput
              id="event-name"
              placeholder="Ej: Servicio Dominical"
              value={name}
              onChangeText={setName}
              maxLength={100}
              size="$4"
              returnKeyType="done"
              onSubmitEditing={handleCreateEvent}
            />
          </YStack>

          <YStack gap="$2">
            <Label>Fecha y hora</Label>
            <Text color="$color10" fontSize="$3">
              {date
                .toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
                .replace(',', '')}
            </Text>
          </YStack>

          <XStack gap="$3" justify="flex-end" mt="$4">
            <Button
              flex={1}
              variant="outlined"
              onPress={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button flex={1} onPress={handleCreateEvent} disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Evento'}
            </Button>
          </XStack>
        </YStack>
      </BottomSheet>
    </>
  );
}

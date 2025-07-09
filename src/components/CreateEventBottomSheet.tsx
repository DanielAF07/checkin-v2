import { eventsService } from '@/src/services';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Button, H4, Label, Text, XStack, YStack } from 'tamagui';
import { BottomSheet } from './ui/BottomSheet';
import { BottomSheetInput } from './ui/BottomSheetInput';

// Función para obtener el próximo domingo a las 11am
const getNextSunday11AM = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  let nextSunday: Date;
  
  if (dayOfWeek === 0) {
    // Si es domingo, usar el día de hoy
    nextSunday = new Date(today);
  } else {
    // Calcular días hasta el próximo domingo
    const daysUntilSunday = 7 - dayOfWeek;
    nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
  }
  
  // Establecer la hora a las 11:00 AM
  nextSunday.setHours(11, 0, 0, 0);
  
  return nextSunday;
};

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
  const [date, setDate] = useState(getNextSunday11AM());
  const [isLoading, setIsLoading] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  // Limpiar formulario cuando se cierra el BottomSheet
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDate(getNextSunday11AM());
      setIsLoading(false);
      setShowDateTimePicker(false);
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
        snapPoints={['45%']}
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
            />
          </YStack>

          <YStack gap="$2">
            <Label>Fecha y hora</Label>

            <XStack gap="$2" items="center">
              <Button
                variant="outlined"
                onPress={() => setShowDateTimePicker(true)}
                flex={1}
                disabled={isLoading}
              >
                <Text fontSize="$3">
                  {date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
                <Text fontSize="$3">
                  {date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
              </Button>
            </XStack>
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
            <Button
              bg="$blue8"
              flex={1}
              onPress={handleCreateEvent}
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Evento'}
            </Button>
          </XStack>
        </YStack>
      </BottomSheet>

      <DatePicker
        modal
        minuteInterval={30}
        open={showDateTimePicker}
        date={date}
        onConfirm={date => {
          setShowDateTimePicker(false);
          setDate(date);
        }}
        onCancel={() => {
          setShowDateTimePicker(false);
        }}
      />
    </>
  );
}

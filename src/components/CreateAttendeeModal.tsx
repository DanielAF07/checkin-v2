import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, Label, Text, XStack, YStack } from 'tamagui';
import { BottomSheet } from './ui/BottomSheet';
import { BottomSheetInput } from './ui/BottomSheetInput';

interface CreateAttendeeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    first_lastname: string;
    second_lastname: string;
  }) => Promise<void>;
  isKeyboardVisible: boolean;
}

export function CreateAttendeeModal({
  open,
  onClose,
  onSubmit,
  isKeyboardVisible = false,
}: CreateAttendeeModalProps) {
  const [name, setName] = useState('');
  const [firstLastname, setFirstLastname] = useState('');
  const [secondLastname, setSecondLastname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !firstLastname.trim() || !secondLastname.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim().toUpperCase(),
        first_lastname: firstLastname.trim().toUpperCase(),
        second_lastname: secondLastname.trim().toUpperCase(),
      });

      // Reset form
      setName('');
      setFirstLastname('');
      setSecondLastname('');
      onClose();
    } catch (error) {
      console.error('Error creating attendee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setFirstLastname('');
      setSecondLastname('');
      onClose();
    }
  };

  const isFormValid =
    name.trim() && firstLastname.trim() && secondLastname.trim();

  return (
    <BottomSheet
      open={open}
      onOpenChange={handleClose}
      snapPoints={[51, 100]}
      defaultPosition={0}
      position={isKeyboardVisible ? 0 : 1}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack gap="$4">
          <Text fontSize="$6" fontWeight="600" text="center">
            Agregar Nueva Persona
          </Text>

          <YStack gap="$2">
            <YStack gap="$1">
              <Label htmlFor="name">Nombre</Label>
              <BottomSheetInput
                id="name"
                value={name}
                onChangeText={setName}
                placeholder="Ingresa el nombre"
                autoCapitalize="characters"
                autoComplete="given-name"
                returnKeyType="next"
                size="$4"
                borderColor="$blue8"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8'
                }}
              />
            </YStack>

            <YStack gap="$1">
              <Label htmlFor="first_lastname">Apellido Paterno</Label>
              <BottomSheetInput
                id="first_lastname"
                value={firstLastname}
                onChangeText={setFirstLastname}
                placeholder="Ingresa el apellido paterno"
                autoCapitalize="characters"
                autoComplete="family-name"
                returnKeyType="next"
                size="$4"
                borderColor="$blue8"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8'
                }}
              />
            </YStack>

            <YStack gap="$1">
              <Label htmlFor="second_lastname">Apellido Materno</Label>
              <BottomSheetInput
                id="second_lastname"
                value={secondLastname}
                onChangeText={setSecondLastname}
                placeholder="Ingresa el apellido materno"
                autoCapitalize="characters"
                autoComplete="family-name"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                size="$4"
                borderColor="$blue8"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8'
                }}
              />
            </YStack>
          </YStack>

          <XStack gap="$3" justify={'flex-end'}>
            <Button
              variant="outlined"
              onPress={handleClose}
              disabled={isSubmitting}
              flex={1}
            >
              Cancelar
            </Button>
            <Button
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              bg="$blue9"
              color="white"
              flex={1}
            >
              {isSubmitting ? 'Guardando...' : 'Agregar'}
            </Button>
          </XStack>
        </YStack>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}

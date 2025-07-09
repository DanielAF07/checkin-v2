import { useRef, useState } from 'react';
import { Keyboard, TextInput, TouchableWithoutFeedback } from 'react-native';
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
}

export function CreateAttendeeModal({
  open,
  onClose,
  onSubmit,
}: CreateAttendeeModalProps) {
  const [name, setName] = useState('');
  const [firstLastname, setFirstLastname] = useState('');
  const [secondLastname, setSecondLastname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs para navegar entre inputs
  const firstLastnameRef = useRef<TextInput>(null);
  const secondLastnameRef = useRef<TextInput>(null);

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
      onClose={handleClose}
      snapPoints={['50%']}
      enablePanDownToClose
      dismissKeyboardOnTap
      resetOnKeyboardHide
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack gap="$4" width="100%" px="$4" py="$3">
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
                blurOnSubmit={false}
                placeholder="Ingresa el nombre"
                autoCapitalize="characters"
                autoComplete="given-name"
                returnKeyType="next"
                onSubmitEditing={() => firstLastnameRef.current?.focus()}
                size="$4"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8',
                }}
              />
            </YStack>

            <YStack gap="$1">
              <Label htmlFor="first_lastname">Apellido Paterno</Label>
              <BottomSheetInput
                ref={firstLastnameRef}
                id="first_lastname"
                value={firstLastname}
                blurOnSubmit={false}
                onChangeText={setFirstLastname}
                placeholder="Ingresa el apellido paterno"
                autoCapitalize="characters"
                autoComplete="family-name"
                returnKeyType="next"
                onSubmitEditing={() => secondLastnameRef.current?.focus()}
                size="$4"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8',
                }}
              />
            </YStack>

            <YStack gap="$1">
              <Label htmlFor="second_lastname">Apellido Materno</Label>
              <BottomSheetInput
                ref={secondLastnameRef}
                id="second_lastname"
                value={secondLastname}
                onChangeText={setSecondLastname}
                placeholder="Ingresa el apellido materno"
                autoCapitalize="characters"
                autoComplete="family-name"
                returnKeyType="done"
                size="$4"
                focusStyle={{
                  borderColor: '$blue10',
                  shadowColor: '$blue8',
                }}
              />
            </YStack>
          </YStack>

          <XStack mt="$4" gap="$3" justify={'flex-end'}>
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

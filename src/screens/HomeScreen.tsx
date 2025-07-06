import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Button, Input, Separator, Text, YStack } from 'tamagui';
import {
  useAttendanceStore,
  type EventWithStats,
} from '../../store/attendanceStore';
import { EventCard, HomeHeader } from '../components';
import { BottomSheet } from '../components/ui/BottomSheet';
import { formatDate } from '../utils';

export function HomeScreen() {
  const router = useRouter();
  const { addEvent, getEventsWithStats } = useAttendanceStore();
  const events = getEventsWithStats();

  const handleCreateNewSunday = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    addEvent('Servicio Dominical', dateString);
    Alert.alert('Nueva Lista', 'Lista de domingo creada exitosamente');
  };

  const handleEventPress = (event: EventWithStats) => {
    router.push(`/attendance/${event.id}`);
  };

  const renderEventItem = ({ item }: { item: EventWithStats }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item)}
      formatDate={formatDate}
    />
  );

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [field1, setField1] = useState<string>('');
  const [field2, setField2] = useState<string>('');

  const handleSubmit = () => {
    Alert.alert('Formulario enviado', `Campo 1: ${field1}\nCampo 2: ${field2}`);
    setField1('');
    setField2('');
    setIsSheetOpen(false);
  };

  return (
    <>
      <YStack flex={1} p="$4">
        <HomeHeader onCreateNew={handleCreateNewSunday} />

        <Separator mb="$4" />

        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <Button onPress={() => setIsSheetOpen(true)}>
          <Text>Open Sheet</Text>
        </Button>
      </YStack>
      <BottomSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        snapPoints={[80]}
        defaultPosition={0}
      >
        <YStack space="$4">
          <Text fontSize="$6" fontWeight="bold">
            Formulario
          </Text>
          <Input
            placeholder="Campo 1"
            value={field1}
            onChangeText={setField1}
            background="$white"
          />
          <Input
            placeholder="Campo 2"
            value={field2}
            onChangeText={setField2}
            background="$white"
          />
          <Button onPress={handleSubmit} background="$blue10">
            <Text color="$white1">Enviar</Text>
          </Button>
        </YStack>
      </BottomSheet>
    </>
  );
}

import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Separator, YStack } from 'tamagui';
import { EventCard, HomeHeader } from '../components';
import { CreateEventBottomSheet } from '../components/CreateEventBottomSheet';
import { attendeesService, eventsService } from '../services';

export function HomeScreen() {
  const router = useRouter();
  const { data: eventsData, isLoading } = eventsService.getWithAttendances();
  const { data: attendeesData } = attendeesService.getAll();
  const events = eventsData?.events || [];
  const attendees = attendeesData?.attendees || [];

  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const handleCreateNewEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleEventCreated = () => {
    // Recargar datos después de crear evento
    // Los datos se actualizarán automáticamente por Instant DB
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/attendance/${eventId}`);
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      totalAttendees={attendees.length || 0}
      onPress={() => handleEventPress(item.id)}
    />
  );

  return (
    <>
      <YStack flex={1} p="$4">
        <HomeHeader onCreateNew={handleCreateNewEvent} />

        <Separator mb="$4" />

        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </YStack>

      <CreateEventBottomSheet
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

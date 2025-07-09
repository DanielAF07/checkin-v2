import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { Separator, YStack } from 'tamagui';
import { EventCard, EventsFilter, HomeHeader } from '../components';
import type { EventFilterType } from '../components';
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
  const [selectedFilter, setSelectedFilter] = useState<EventFilterType>('upcoming');

  const handleCreateNewEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleEventCreated = () => {
    // Recargar datos después de crear evento
    // Los datos se actualizarán automáticamente por Instant DB
  };

  // Filtrar y ordenar eventos
  const filteredAndSortedEvents = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Primero ordenar por fecha (más reciente primero)
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // Más reciente primero
    });

    // Luego filtrar según la selección
    if (selectedFilter === 'upcoming') {
      // Incluir eventos de hoy y futuros (sin importar la hora del día)
      return sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        return eventDateStart >= todayStart;
      });
    } else {
      // Solo eventos de días anteriores
      return sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        return eventDateStart < todayStart;
      });
    }
  }, [events, selectedFilter]);

  // Contadores para los filtros
  const eventCounts = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const upcomingCount = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return eventDateStart >= todayStart; // Incluye eventos de hoy
    }).length;
    
    const pastCount = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventDateStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return eventDateStart < todayStart; // Solo eventos de días anteriores
    }).length;
    
    return {
      total: events.length,
      upcoming: upcomingCount,
      past: pastCount,
    };
  }, [events]);

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

        <EventsFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          upcomingCount={eventCounts.upcoming}
          pastCount={eventCounts.past}
        />

        <FlatList
          data={filteredAndSortedEvents}
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


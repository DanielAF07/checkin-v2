import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { YStack } from 'tamagui';
import {
  useAttendanceStore,
  type AttendeeWithPresence,
} from '../../store/attendanceStore';
import {
  AttendanceCounter,
  AttendanceHeader,
  AttendeeCard,
  SearchBar,
} from '../components';
import { formatDate, normalizeText } from '../utils';

export function AttendanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const eventId = parseInt(id as string);
  const {
    getEventById,
    getAttendeesWithPresence,
    toggleAttendance,
    getAttendanceCount,
    getAttendeeFullName,
  } = useAttendanceStore();

  const event = getEventById(eventId);
  const allAttendeesWithPresence = getAttendeesWithPresence(eventId);
  
  // Filtrar asistentes basado en la búsqueda
  const filteredAttendees = useMemo(() => {
    if (!searchText.trim()) {
      return allAttendeesWithPresence;
    }
    
    const searchNormalized = normalizeText(searchText);
    return allAttendeesWithPresence.filter(attendee => {
      const fullName = normalizeText(getAttendeeFullName(attendee));
      return fullName.includes(searchNormalized);
    });
  }, [allAttendeesWithPresence, searchText, getAttendeeFullName]);

  const attendanceCount = getAttendanceCount(eventId);
  const totalAttendees = allAttendeesWithPresence.length;

  const handleToggleAttendance = (attendeeId: number) => {
    toggleAttendance(eventId, attendeeId);
  };

  // Scroll al inicio cuando cambie el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() && filteredAttendees.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [searchText, filteredAttendees.length]);

  const renderAttendeeItem = ({ item }: { item: AttendeeWithPresence }) => (
    <AttendeeCard
      attendee={item}
      onToggle={() => handleToggleAttendance(item.id)}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack flex={1} background="$background" p="$4">
        <AttendanceHeader
          title={event ? formatDate(event.date) : 'Cargando...'}
          onBack={() => router.back()}
        />

        <AttendanceCounter
          attendanceCount={attendanceCount}
          totalAttendees={totalAttendees}
        />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar persona..."
        />

        <FlatList
          ref={flatListRef}
          data={filteredAttendees}
          renderItem={renderAttendeeItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          // Optimizaciones para dispositivos lentos
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={15}
          windowSize={10}
          getItemLayout={(_, index) => ({
            length: 88, // altura estimada de cada AttendeeCard
            offset: 88 * index,
            index,
          })}
        />
      </YStack>
    </TouchableWithoutFeedback>
  );
}

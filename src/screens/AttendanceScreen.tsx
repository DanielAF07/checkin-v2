import { Plus } from '@tamagui/lucide-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, SectionList, TouchableWithoutFeedback } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { Button, Text, YStack } from 'tamagui';
import type { FilterType } from '../components';
import {
  AttendanceCounter,
  AttendanceHeader,
  AttendeeCard,
  CreateAttendeeModal,
  FilterToggle,
  SearchBar,
} from '../components';
import { useGradualAnimation } from '../hooks/useGradualAnimation';
import { useKeyboardState } from '../hooks/useKeyboardState';
import {
  attendanceService,
  attendeesService,
  eventsService,
} from '../services';
import { normalizeText } from '../utils';

export function AttendanceScreen() {
  const { height } = useGradualAnimation();
  const { isKeyboardVisible: keyboardState } = useKeyboardState();

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const sectionListRef = useRef<SectionList>(null);

  const eventId = id as string;

  // Obtener datos desde Instant DB
  const { data: eventData } = eventsService.getById(eventId);
  const { data: attendeesData } = attendeesService.getAll();
  const { data: attendanceData } = attendanceService.getByEventId(eventId);

  const event = eventData?.events?.[0];
  const allAttendees = attendeesData?.attendees || [];
  const attendanceRecords = attendanceData?.attendance || [];

  // Crear lista de asistentes con estado de presencia
  const allAttendeesWithPresence = useMemo(() => {
    return allAttendees
      .map(attendee => {
        const attendanceRecord = attendanceRecords.find(
          record => record.attendee?.id === attendee.id
        );
        return {
          ...attendee,
          isPresent: !!attendanceRecord,
          attendanceId: attendanceRecord?.id,
        };
      })
      .sort((a, b) => {
        // Sort by first_lastname, then second_lastname, then name
        if (a.first_lastname !== b.first_lastname) {
          return a.first_lastname.localeCompare(b.first_lastname);
        }
        if (a.second_lastname !== b.second_lastname) {
          return a.second_lastname.localeCompare(b.second_lastname);
        }
        return a.name.localeCompare(b.name);
      });
  }, [allAttendees, attendanceRecords]);

  // Filtrar asistentes basado en la búsqueda y filtros
  const filteredAttendees = useMemo(() => {
    let filtered = allAttendeesWithPresence;

    // Aplicar filtro por tipo
    if (selectedFilter === 'present') {
      filtered = filtered.filter(attendee => attendee.isPresent);
    } else if (selectedFilter === 'no-piime') {
      filtered = filtered.filter(attendee => !attendee.piime_id);
    }

    // Aplicar filtro de búsqueda
    if (searchText.trim()) {
      const searchNormalized = normalizeText(searchText);
      filtered = filtered.filter(attendee => {
        const fullName = normalizeText(
          `${attendee.name} ${attendee.first_lastname} ${attendee.second_lastname}`
        );
        return fullName.includes(searchNormalized);
      });
    }

    return filtered;
  }, [allAttendeesWithPresence, searchText, selectedFilter]);

  // Agrupar asistentes por la primera letra del apellido para SectionList
  const sectionData = useMemo(() => {
    const grouped = filteredAttendees.reduce(
      (acc, attendee) => {
        const firstLetter = attendee.first_lastname.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(attendee);
        return acc;
      },
      {} as Record<string, typeof filteredAttendees>
    );

    // Convertir a formato SectionList y ordenar por letra
    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter],
      }));
  }, [filteredAttendees]);

  const attendanceCount = attendanceRecords.length;
  const totalAttendees = allAttendees.length;
  const noPiimeCount = allAttendeesWithPresence.filter(
    attendee => !attendee.piime_id
  ).length;

  const handleToggleAttendance = async (attendee: any) => {
    try {
      if (attendee.isPresent && attendee.attendanceId) {
        // Mark as absent
        await attendanceService.markAbsent(attendee.attendanceId);
      } else {
        // Mark as present
        await attendanceService.markPresent(eventId, attendee.id);
      }
    } catch (error) {
      console.error('Error toggling attendance:', error);
    }
  };

  const handleCreateAttendee = async (attendeeData: {
    name: string;
    first_lastname: string;
    second_lastname: string;
  }) => {
    try {
      await attendeesService.create(attendeeData);
    } catch (error) {
      console.error('Error creating attendee:', error);
      throw error;
    }
  };

  // Scroll al inicio cuando cambie el texto de búsqueda
  useEffect(() => {
    if (searchText.trim() && sectionData.length > 0) {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        animated: true,
      });
    }
  }, [searchText, sectionData.length]);

  const renderSectionHeader = ({ section }: any) => (
    <YStack
      bg="$background"
      px="$3"
      py="$2"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      mb="$1"
    >
      <Text
        fontSize="$8"
        fontWeight="bold"
        color="$color"
        textTransform="uppercase"
      >
        {section.title}
      </Text>
    </YStack>
  );

  const renderAttendeeItem = ({ item }: { item: any }) => (
    <AttendeeCard
      attendee={item}
      onToggle={() => handleToggleAttendance(item)}
    />
  );

  return (
    <YStack flex={1}>
      <YStack flex={1}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1} pt="$4" px="$4">
            <AttendanceHeader
              title={event?.name ? event.name : 'Cargando...'}
              onBack={() => router.back()}
            />

            <AttendanceCounter
              attendanceCount={attendanceCount}
              totalAttendees={totalAttendees}
            />

            <FilterToggle
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              noPiimeCount={noPiimeCount}
            />

            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar persona..."
            />

            <SectionList
              ref={sectionListRef}
              sections={sectionData}
              renderItem={renderAttendeeItem}
              renderSectionHeader={renderSectionHeader}
              keyExtractor={item => item.id}
              stickySectionHeadersEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
              // Optimizaciones para dispositivos lentos
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={15}
              windowSize={10}
            />

            {/* Floating Action Button */}
            <Button
              position="absolute"
              b={40}
              r={30}
              size="$6"
              circular
              bg="$blue9"
              color="white"
              icon={Plus}
              scaleIcon={1.5}
              onPress={() => setShowCreateModal(true)}
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
            />
          </YStack>
        </TouchableWithoutFeedback>
        <CreateAttendeeModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAttendee}
        />
      </YStack>
    </YStack>
  );
}

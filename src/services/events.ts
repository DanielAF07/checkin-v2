import { instantDb } from '@/src/config/instant/instantDb';
import { id } from '@instantdb/react-native';
import type { AppSchema } from '../../instant.schema';

export type Event = AppSchema['entities']['events'];
export type EventInput = {
  name: string;
  date: number; // timestamp
  active?: boolean;
};

// Tipos para respuestas de queries (usando el hook directamente)
export type EventsQuery = ReturnType<typeof instantDb.useQuery<{
  events: {};
}>>;

export type EventWithAttendancesQuery = ReturnType<typeof instantDb.useQuery<{
  events: {
    attendances: {
      attendee: {};
    };
  };
}>>;

export type SingleEventQuery = ReturnType<typeof instantDb.useQuery<{
  events: {};
}>>;

export const eventsService = {
  // Get all events
  getAll: () => {
    return instantDb.useQuery({
      events: {
        $: {
          order: {
            date: 'desc',
          },
        },
      },
    });
  },

  // Get event by ID
  getById: (eventId: string) => {
    return instantDb.useQuery({
      events: {
        $: {
          where: { id: eventId },
        },
      },
    });
  },

  // Create new event
  create: async (eventData: EventInput) => {
    const eventId = id();
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.events[eventId].update({
        ...eventData,
        created: now.getTime(),
        updated: now.getTime(),
      }),
    ]);

    return eventId;
  },

  // Update event
  update: async (eventId: string, eventData: Partial<EventInput>) => {
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.events[eventId].update({
        ...eventData,
        updated: now.getTime(),
      }),
    ]);
  },

  // Soft delete event (set active to false)
  softDelete: async (eventId: string) => {
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.events[eventId].update({
        updated: now.getTime(),
      }),
    ]);
  },

  // Hard delete event
  delete: async (eventId: string) => {
    await instantDb.transact([instantDb.tx.events[eventId].delete()]);
  },

  // Get events by date range
  getByDateRange: (startDate: number, endDate: number) => {
    return instantDb.useQuery({
      events: {
        $: {
          where: {
            date: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          order: { date: 'desc' },
        },
      },
    });
  },

  // Get events with their attendance records
  getWithAttendances: () => {
    return instantDb.useQuery({
      events: {
        $: {
          order: { date: 'desc' },
        },
        attendances: {
          attendee: {},
        },
      },
    });
  },

  // Get event with attendance count
  getWithAttendanceCount: (eventId: string) => {
    return instantDb.useQuery({
      events: {
        $: {
          where: { id: eventId },
        },
        attendances: {},
      },
    });
  },

  // Get recent events (last 30 days)
  getRecent: () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return instantDb.useQuery({
      events: {
        $: {
          where: {
            date: { $gte: thirtyDaysAgo.getTime() },
          },
          order: { date: 'desc' },
        },
      },
    });
  },
};

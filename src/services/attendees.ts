import { instantDb } from '@/src/config/instant/instantDb';
import { id, type InstaQLResponse } from '@instantdb/react-native';
import type { AppSchema } from './../../instant.schema';

export type Attendee = AppSchema['entities']['attendees'];
export type AttendeeInput = {
  name: string;
  first_lastname: string;
  second_lastname: string;
  piime_id?: string;
  active?: boolean;
};

// Tipos para respuestas de queries
export type AttendeesQuery = InstaQLResponse<
  AppSchema,
  {
    attendees: {};
  }
>;

export type AttendeeWithAttendancesQuery = InstaQLResponse<
  AppSchema,
  {
    attendees: {
      attendances: {};
    };
  }
>;

export type SingleAttendeeQuery = InstaQLResponse<
  AppSchema,
  {
    attendees: {};
  }
>;

export const attendeesService = {
  // Get all attendees
  getAll: () => {
    return instantDb.useQuery({
      attendees: {
        $: {
          where: { active: true },
        },
      },
    });
  },

  // Get attendee by ID
  getById: (attendeeId: string) => {
    return instantDb.useQuery({
      attendees: {
        $: {
          where: { id: attendeeId },
        },
      },
    });
  },

  // Create new attendee
  create: async (attendeeData: AttendeeInput) => {
    const attendeeId = id();
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.attendees[attendeeId].update({
        ...attendeeData,
        active: attendeeData.active ?? true,
        created: now.getTime(),
        updated: now.getTime(),
      }),
    ]);

    return attendeeId;
  },

  // Update attendee
  update: async (attendeeId: string, attendeeData: Partial<AttendeeInput>) => {
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.attendees[attendeeId].update({
        ...attendeeData,
        updated: now.getTime(),
      }),
    ]);
  },

  // Soft delete attendee (set active to false)
  softDelete: async (attendeeId: string) => {
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.attendees[attendeeId].update({
        active: false,
        updated: now.getTime(),
      }),
    ]);
  },

  // Hard delete attendee
  delete: async (attendeeId: string) => {
    await instantDb.transact([instantDb.tx.attendees[attendeeId].delete()]);
  },

  // Search attendees by name
  searchByName: (searchTerm: string) => {
    return instantDb.useQuery({
      attendees: {
        $: {
          where: {
            active: true,
            or: [
              { name: { $ilike: `%${searchTerm}%` } },
              { first_lastname: { $ilike: `%${searchTerm}%` } },
              { second_lastname: { $ilike: `%${searchTerm}%` } },
            ],
          },
          order: { serverCreatedAt: 'asc' },
        },
      },
    });
  },

  // Get attendees with their attendance records
  getWithAttendances: () => {
    return instantDb.useQuery({
      attendees: {
        $: {
          where: { active: true },
          order: { serverCreatedAt: 'asc' },
        },
        attendances: {},
      },
    });
  },
};

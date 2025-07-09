import { instantDb } from '@/src/config/instant/instantDb';
import { id, type InstaQLResponse } from '@instantdb/react-native';
import type { AppSchema } from '../../instant.schema';

export type Attendance = AppSchema['entities']['attendance'];
export type AttendanceInput = {
  eventId: string;
  attendeeId: string;
};

// Tipos para respuestas de queries
export type AttendanceQuery = InstaQLResponse<
  AppSchema,
  {
    attendance: {
      event: {};
      attendee: {};
    };
  }
>;

export type AttendanceStatsQuery = InstaQLResponse<
  AppSchema,
  {
    events: {
      attendances: {
        attendee: {};
      };
    };
    attendees: {};
  }
>;

export type AttendanceCountQuery = InstaQLResponse<
  AppSchema,
  {
    attendance: {};
  }
>;

export const attendanceService = {
  // Get all attendance records
  getAll: () => {
    return instantDb.useQuery({
      attendance: {
        $: {
          order: { serverCreatedAt: 'desc' },
        },
        event: {},
        attendee: {},
      },
    });
  },

  // Get attendance by event ID
  getByEventId: (eventId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          order: { serverCreatedAt: 'asc' },
          where: { event: eventId },
        },
        attendee: {},
      },
    });
  },

  // Get attendance by attendee ID
  getByAttendeeId: (attendeeId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          order: { serverCreatedAt: 'desc' },
        },
        event: {},
        attendee: {
          $: {
            where: { id: attendeeId },
          },
        },
      },
    });
  },

  // Check if attendee is already marked as present for an event
  isAttendeePresent: (eventId: string, attendeeId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          where: {
            and: [{ event: eventId }, { attendee: attendeeId }],
          },
        },
      },
    });
  },

  // Mark attendee as present (create attendance record)
  markPresent: async (eventId: string, attendeeId: string) => {
    const attendanceId = id();
    const now = new Date();

    await instantDb.transact([
      instantDb.tx.attendance[attendanceId].update({
        created: now.getTime(),
        updated: now.getTime(),
      }),
      instantDb.tx.attendance[attendanceId].link({
        event: eventId,
        attendee: attendeeId,
      }),
    ]);

    return attendanceId;
  },

  // Mark attendee as absent (remove attendance record)
  // Note: This function requires the attendanceId to avoid conditional useQuery
  markAbsent: async (attendanceId: string) => {
    await instantDb.transact([instantDb.tx.attendance[attendanceId].delete()]);
  },

  // Find attendance record for an attendee in an event
  findAttendanceRecord: (eventId: string, attendeeId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          where: {
            and: [{ event: eventId }, { attendee: attendeeId }],
          },
        },
      },
    });
  },

  // Simplified toggle - requires current state to avoid conditional hooks
  toggleAttendance: async (
    eventId: string,
    attendeeId: string,
    isCurrentlyPresent: boolean,
    attendanceId?: string
  ) => {
    if (isCurrentlyPresent && attendanceId) {
      await attendanceService.markAbsent(attendanceId);
      return false; // Now absent
    } else {
      await attendanceService.markPresent(eventId, attendeeId);
      return true; // Now present
    }
  },

  // Get attendance count for an event
  getAttendanceCount: (eventId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          where: { event: eventId },
        },
      },
    });
  },

  // Get attendance statistics for an event
  getEventStats: (eventId: string) => {
    return instantDb.useQuery({
      events: {
        $: {
          where: { id: eventId },
        },
        attendances: {
          attendee: {},
        },
      },
      attendees: {
        $: {
          where: { active: true },
        },
      },
    });
  },

  // Get attendance history for a specific attendee
  getAttendeeHistory: (attendeeId: string) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          order: { serverCreatedAt: 'desc' },
        },
        event: {},
        attendee: {
          $: {
            where: { id: attendeeId },
          },
        },
      },
    });
  },

  // Get attendance records for a date range
  getByDateRange: (startDate: number, endDate: number) => {
    return instantDb.useQuery({
      attendance: {
        $: {
          order: { serverCreatedAt: 'desc' },
        },
        event: {
          $: {
            where: {
              date: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
        },
        attendee: {},
      },
    });
  },

  // Bulk mark multiple attendees as present
  bulkMarkPresent: async (eventId: string, attendeeIds: string[]) => {
    const now = new Date();
    const transactions = attendeeIds
      .map(attendeeId => {
        const attendanceId = id();
        return [
          instantDb.tx.attendance[attendanceId].update({
            created: now.getTime(),
            updated: now.getTime(),
          }),
          instantDb.tx.attendance[attendanceId].link({
            event: eventId,
            attendee: attendeeId,
          }),
        ];
      })
      .flat();

    await instantDb.transact(transactions);
  },
};

// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/core';

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    attendees: i.entity({
      name: i.string(),
      first_lastname: i.string(),
      second_lastname: i.string(),
      piime_id: i.string().optional(),
      active: i.boolean(),
      created: i.date(),
      updated: i.date(),
    }),
    events: i.entity({
      name: i.string(),
      date: i.date(),
      created: i.date(),
      updated: i.date(),
    }),
    attendance: i.entity({
      created: i.date(),
      updated: i.date(),
    }),
  },
  links: {
    attendanceEvent: {
      forward: { on: 'attendance', has: 'one', label: 'event' },
      reverse: { on: 'events', has: 'many', label: 'attendances' },
    },
    attendanceAttendee: {
      forward: { on: 'attendance', has: 'one', label: 'attendee' },
      reverse: { on: 'attendees', has: 'many', label: 'attendances' },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

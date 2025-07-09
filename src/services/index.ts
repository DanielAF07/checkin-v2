export { attendeesService } from './attendees';
export { eventsService } from './events';
export { attendanceService } from './attendance';

export type { 
  Attendee, 
  AttendeeInput, 
  AttendeesQuery, 
  AttendeeWithAttendancesQuery, 
  SingleAttendeeQuery 
} from './attendees';

export type { 
  Event, 
  EventInput, 
  EventsQuery, 
  EventWithAttendancesQuery, 
  SingleEventQuery 
} from './events';

export type { 
  Attendance, 
  AttendanceInput, 
  AttendanceQuery, 
  AttendanceStatsQuery, 
  AttendanceCountQuery 
} from './attendance';
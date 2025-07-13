import { init } from '@instantdb/admin';
import { config } from 'dotenv';
import inquirer from 'inquirer';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import schema from '../instant.schema';

config({ path: '.env.local' });

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || '';

export const instantDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema: schema,
});

interface Event {
  id: string;
  name: string;
  date: string | number;
  created: string | number;
  updated: string | number;
}

interface AttendanceRecord {
  id: string;
  created: string | number;
  updated: string | number;
  attendee: {
    id: string;
    piime_id?: string;
    name: string;
    first_lastname: string;
    second_lastname: string;
  };
}

async function getAttendanceScript() {
  try {
    console.log('📅 Fetching latest events...\n');

    // Fetch events
    const eventsResult = await instantDb.query({
      events: {},
    });

    if (!eventsResult.events || eventsResult.events.length === 0) {
      console.log('No events found.');
      return;
    }

    // Sort events by date (newest to oldest) and take last 10
    const sortedEvents = eventsResult.events
      .sort((a: Event, b: Event) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Newest first
      })
      .slice(0, 10);

    // Create choices for inquirer
    const eventChoices = sortedEvents.map((event: Event) => ({
      name: `${event.name} - ${new Date(event.date).toLocaleDateString()}`,
      value: event.id,
      short: event.name,
    }));

    // Prompt user to select an event
    const { selectedEventId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedEventId',
        message: 'Select an event to get attendance:',
        choices: eventChoices,
      },
    ]);

    const selectedEvent = sortedEvents.find(e => e.id === selectedEventId);
    console.log(`\n🎯 Selected: ${selectedEvent?.name} - ${new Date(selectedEvent?.date || '').toLocaleDateString()}\n`);

    // Fetch attendance for selected event
    console.log('👥 Fetching attendance records...');
    
    const attendanceResult = await instantDb.query({
      attendance: {
        event: {},
        attendee: {},
      },
    });

    if (!attendanceResult.attendance) {
      console.log('No attendance records found.');
      return;
    }

    // Filter attendance for selected event
    const eventAttendance = attendanceResult.attendance.filter(
      (record: any) => record.event?.id === selectedEventId
    );

    if (eventAttendance.length === 0) {
      console.log(`No attendance records found for event: ${selectedEvent?.name}`);
      return;
    }

    console.log(`Found ${eventAttendance.length} attendance records`);

    // Extract piime_id values
    const piimeIds: string[] = [];
    eventAttendance.forEach((record: AttendanceRecord) => {
      if (record.attendee?.piime_id) {
        piimeIds.push(record.attendee.piime_id);
      }
    });

    console.log(`Found ${piimeIds.length} attendees with piime_id`);

    if (piimeIds.length === 0) {
      console.log('No attendees with piime_id found.');
      return;
    }

    // Create filename with event name and date
    const eventDate = new Date(selectedEvent?.date || '').toISOString().split('T')[0];
    const sanitizedEventName = selectedEvent?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `attendance_${sanitizedEventName}_${eventDate}.txt`;
    
    // Ensure attendance_lists directory exists
    const attendanceListsDir = join(__dirname, 'attendance_lists');
    mkdirSync(attendanceListsDir, { recursive: true });
    
    const filepath = join(attendanceListsDir, filename);

    // Write piime_ids to file
    const content = piimeIds.join('\n');
    writeFileSync(filepath, content, 'utf8');

    console.log(`\n✅ Successfully wrote ${piimeIds.length} piime_id values to: ${filename}`);
    console.log(`📄 File location: ${filepath}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getAttendanceScript();
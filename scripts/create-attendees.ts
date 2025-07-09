import { id, init } from '@instantdb/admin';
import { readFileSync } from 'fs';
import { join } from 'path';
import schema from '../instant.schema';
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || '';

export const instantDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema: schema,
});

interface AttendeeData {
  create: {
    attendees: {
      name: string;
      first_lastname: string;
      second_lastname: string;
      piime_id: string;
      active: boolean;
      created: string;
      updated: string;
    };
  };
}

async function createAttendees() {
  try {
    const attendeesJsonPath = join(__dirname, '../attendees.json');
    const attendeesData: AttendeeData[] = JSON.parse(
      readFileSync(attendeesJsonPath, 'utf-8')
    );

    console.log(`Found ${attendeesData.length} attendees to create`);
    const attendeesToCreate = attendeesData.map(item => {
      const attendee = item.create.attendees;
      return {
        name: attendee.name,
        first_lastname: attendee.first_lastname,
        second_lastname: attendee.second_lastname,
        piime_id: attendee.piime_id,
        active: attendee.active,
        created: new Date().getTime(),
        updated: new Date().getTime(),
      };
    });
    for (let i = 0; i < attendeesToCreate.length; i++) {
      const attendee = attendeesToCreate[i];
      try {
        await instantDb.transact([
          instantDb.tx.attendees[id()].create(attendee),
        ]);
        console.log(
          `Created attendee ${i + 1}/${attendeesToCreate.length}: ${attendee.name} ${attendee.first_lastname}`
        );
      } catch (error) {
        console.error(`Error creating attendee ${attendee.name}:`, error);
      }
    }

    console.log('✅ All attendees created successfully!');
  } catch (error) {
    console.error('❌ Error creating attendees:', error);
  }
}

createAttendees();

import { init } from '@instantdb/admin';
import { config } from 'dotenv';
import schema from '../instant.schema';

config({ path: '.env.local' });

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || '';

export const instantDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema: schema,
});

interface AttendanceRecord {
  id: string;
  created: string | number;
  updated: string | number;
  event: {
    id: string;
    name: string;
    date: string | number;
  };
  attendee: {
    id: string;
    piime_id: string;
    name: string;
    first_lastname: string;
    second_lastname: string;
  };
}

interface DuplicateGroup {
  eventId: string;
  eventName: string;
  eventDate: string | number;
  attendeeId: string;
  attendeeName: string;
  records: AttendanceRecord[];
  count: number;
}

async function eliminateDuplicateAttendance() {
  try {
    console.log('🔍 Searching for duplicate attendance records...\n');

    const result = await instantDb.query({
      attendance: {
        event: {},
        attendee: {},
      },
    });

    if (!result.attendance) {
      console.log('No attendance records found.');
      return;
    }

    const attendanceRecords: AttendanceRecord[] = result.attendance;
    const groupedByEventAndAttendee = new Map<string, AttendanceRecord[]>();

    attendanceRecords.forEach(record => {
      if (record.event && record.attendee) {
        const key = `${record.event.id}-${record.attendee.id}`;
        if (!groupedByEventAndAttendee.has(key)) {
          groupedByEventAndAttendee.set(key, []);
        }
        groupedByEventAndAttendee.get(key)!.push(record);
      }
    });

    const duplicates: DuplicateGroup[] = [];
    groupedByEventAndAttendee.forEach(records => {
      if (records.length > 1) {
        // Sort by creation date to keep the oldest one
        records.sort((a, b) => {
          const dateA = new Date(a.created).getTime();
          const dateB = new Date(b.created).getTime();
          return dateA - dateB;
        });

        const firstRecord = records[0];
        duplicates.push({
          eventId: firstRecord.event.id,
          eventName: firstRecord.event.name,
          eventDate: firstRecord.event.date,
          attendeeId: firstRecord.attendee.id,
          attendeeName:
            `${firstRecord.attendee.name} ${firstRecord.attendee.first_lastname} ${firstRecord.attendee.second_lastname}`.trim(),
          records,
          count: records.length,
        });
      }
    });

    if (duplicates.length === 0) {
      console.log('✅ No duplicate attendance records found!');
      return;
    }

    console.log(`❌ Found ${duplicates.length} duplicate attendance groups:\n`);

    let totalDeleted = 0;

    for (const duplicate of duplicates) {
      console.log(
        `Event: ${duplicate.eventName} (${new Date(duplicate.eventDate).toDateString()})`
      );
      console.log(`Attendee: ${duplicate.attendeeName}`);
      console.log(`Found ${duplicate.count} duplicate records`);

      // Keep the first (oldest) record, delete the rest
      const recordsToDelete = duplicate.records.slice(1);
      console.log(
        `Keeping oldest record: ${duplicate.records[0].id} (${new Date(duplicate.records[0].created).toISOString()})`
      );
      console.log(`Deleting ${recordsToDelete.length} duplicate records:`);

      for (const record of recordsToDelete) {
        try {
          await instantDb.transact([
            instantDb.tx.attendance[record.id].delete(),
          ]);
          console.log(
            `  ✅ Deleted: ${record.id} (${new Date(record.created).toISOString()})`
          );
          totalDeleted++;
        } catch (error) {
          console.error(`  ❌ Failed to delete ${record.id}:`, error);
        }
      }
      console.log('');
    }

    console.log(`\n🎉 Successfully deleted ${totalDeleted} duplicate records!`);
    console.log(
      `Kept ${duplicates.length} unique attendance records (oldest from each group)`
    );
  } catch (error) {
    console.error('❌ Error eliminating duplicate attendance:', error);
  }
}

eliminateDuplicateAttendance();

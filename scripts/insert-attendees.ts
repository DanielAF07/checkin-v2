import { id, init } from '@instantdb/admin';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as XLSX from 'xlsx';
import schema from '../instant.schema';

config({ path: '.env.local' });

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';
const ADMIN_TOKEN = process.env.INSTANT_ADMIN_TOKEN || '';

export const instantDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema: schema,
});

interface ExcelRecord {
  Fotografía: string;
  Nombre: string;
  'Apellido paterno': string;
  'Apellido materno': string;
  'Sexo de nacimiento': string;
  Edad: string;
  'Estado civil': string;
  'Teléfono 1': string;
  'Clasificación de asistente': string;
  'ID Asistente': string;
}

interface AttendeeData {
  name: string;
  first_lastname: string;
  second_lastname: string;
  piime_id: string;
  active: boolean;
  created: number;
  updated: number;
}

// Function to normalize names for comparison
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  // If one string is empty, return the length of the other
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;
  
  // Create matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity percentage between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 100; // Both strings are empty
  
  const similarity = ((maxLength - distance) / maxLength) * 100;
  return Math.round(similarity * 100) / 100; // Round to 2 decimal places
}

// Configuration
const SIMILARITY_THRESHOLD = 90; // Minimum similarity percentage for match

// Function to find matching attendee by name using fuzzy matching
function findMatchingAttendee(
  excelRecord: ExcelRecord,
  attendeesWithoutPiimeId: any[]
): { attendee: any; similarity: number } | null {
  const excelFirstName = normalizeName(excelRecord.Nombre || '');
  const excelFirstLastname = normalizeName(
    excelRecord['Apellido paterno'] || ''
  );
  const excelSecondLastname = normalizeName(
    excelRecord['Apellido materno'] || ''
  );

  let bestMatch: { attendee: any; similarity: number } | null = null;

  for (const attendee of attendeesWithoutPiimeId) {
    const dbFirstName = normalizeName(attendee.name || '');
    const dbFirstLastname = normalizeName(attendee.first_lastname || '');
    const dbSecondLastname = normalizeName(attendee.second_lastname || '');

    // Create full name strings for comparison
    const excelFullName = `${excelFirstName} ${excelFirstLastname} ${excelSecondLastname}`.trim();
    const dbFullName = `${dbFirstName} ${dbFirstLastname} ${dbSecondLastname}`.trim();

    // Calculate similarity for full names
    const fullNameSimilarity = calculateSimilarity(excelFullName, dbFullName);

    // Also calculate similarity for first name + first lastname only (more reliable)
    const excelBasicName = `${excelFirstName} ${excelFirstLastname}`.trim();
    const dbBasicName = `${dbFirstName} ${dbFirstLastname}`.trim();
    const basicNameSimilarity = calculateSimilarity(excelBasicName, dbBasicName);

    // Use the higher similarity score, but prioritize basic name matching
    const finalSimilarity = Math.max(fullNameSimilarity, basicNameSimilarity * 1.1); // Give slight boost to basic name matching

    // Check if this is above our threshold and better than current best
    if (finalSimilarity >= SIMILARITY_THRESHOLD) {
      if (!bestMatch || finalSimilarity > bestMatch.similarity) {
        bestMatch = {
          attendee,
          similarity: finalSimilarity
        };
      }
    }
  }

  return bestMatch;
}

async function insertAttendeesFromXlsx() {
  try {
    // Path to Excel file
    const filePath = join(
      process.cwd(),
      'scripts/insert_attendees_xlsx/grid.xlsx'
    );

    console.log(`📊 Reading Excel file: ${filePath}\n`);

    // Read the file
    const fileBuffer = readFileSync(filePath);

    // Parse the workbook
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    console.log(`📋 Available sheets: ${workbook.SheetNames.join(', ')}\n`);

    // Get existing attendees
    console.log('🔍 Fetching existing attendees from database...');
    const existingResult = await instantDb.query({
      attendees: {},
    });

    const existingAttendees = existingResult.attendees || [];

    // Separate attendees with and without piime_id
    const attendeesWithPiimeId = existingAttendees.filter(a => a.piime_id);
    const attendeesWithoutPiimeId = existingAttendees.filter(a => !a.piime_id);

    const existingPiimeIds = new Set(attendeesWithPiimeId.map(a => a.piime_id));

    console.log(
      `Found ${existingAttendees.length} existing attendees in database`
    );
    console.log(`- With piime_id: ${attendeesWithPiimeId.length}`);
    console.log(`- Without piime_id: ${attendeesWithoutPiimeId.length}\n`);

    let totalProcessed = 0;
    let totalUpdated = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    // Process the first sheet
    const sheetName = workbook.SheetNames[0];
    console.log(`Processing sheet: ${sheetName}`);

    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON with object format
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRecord[];

    console.log(`Found ${jsonData.length} records to process\n`);

    for (let i = 0; i < jsonData.length; i++) {
      const record = jsonData[i];
      totalProcessed++;

      // Skip if no ID Asistente
      if (!record['ID Asistente'] || record['ID Asistente'] === '') {
        // console.log(`⚠️  Row ${i + 1}: Skipping - No ID Asistente`);
        totalSkipped++;
        continue;
      }

      const piimeId = record['ID Asistente'].toString().trim();

      // Check if this piime_id already exists in database
      if (existingPiimeIds.has(piimeId)) {
        // console.log(`⏭️  Row ${i + 1}: Skipping - ID ${piimeId} already exists`);
        totalSkipped++;
        continue;
      }

      // Validate required fields from Excel
      const excelName = record['Nombre']?.toString().trim() || '';
      const excelFirstLastname =
        record['Apellido paterno']?.toString().trim() || '';

      if (!excelName || !excelFirstLastname) {
        // console.log(`⚠️  Row ${i + 1}: Skipping - Missing required fields (name or first_lastname)`);
        totalSkipped++;
        continue;
      }

      // Try to find matching attendee without piime_id
      const matchResult = findMatchingAttendee(
        record,
        attendeesWithoutPiimeId
      );

      if (matchResult) {
        const { attendee: matchingAttendee, similarity } = matchResult;
        
        // Update existing attendee with piime_id
        try {
          await instantDb.transact([
            instantDb.tx.attendees[matchingAttendee.id].update({
              piime_id: piimeId,
              updated: Date.now(),
            }),
          ]);

          console.log(
            `🔄 Row ${i + 1}: Updated - ${matchingAttendee.name} ${matchingAttendee.first_lastname} with ID: ${piimeId} (${similarity.toFixed(1)}% match)`
          );

          totalUpdated++;
          existingPiimeIds.add(piimeId);

          // Remove from attendeesWithoutPiimeId to avoid duplicate matches
          const index = attendeesWithoutPiimeId.indexOf(matchingAttendee);
          if (index > -1) {
            attendeesWithoutPiimeId.splice(index, 1);
          }
        } catch (error) {
          console.error(`❌ Row ${i + 1}: Failed to update - ${error}`);
          totalSkipped++;
        }
      } else {
        // Create new attendee
        const attendeeData: AttendeeData = {
          name: excelName,
          first_lastname: excelFirstLastname,
          second_lastname: record['Apellido materno']?.toString().trim() || '',
          piime_id: piimeId,
          active: true,
          created: Date.now(),
          updated: Date.now(),
        };

        try {
          await instantDb.transact([
            instantDb.tx.attendees[id()].create(attendeeData),
          ]);

          console.log(
            `✅ Row ${i + 1}: Created - ${attendeeData.name} ${attendeeData.first_lastname} (ID: ${piimeId})`
          );

          totalInserted++;
          existingPiimeIds.add(piimeId);
        } catch (error) {
          console.error(`❌ Row ${i + 1}: Failed to insert - ${error}`);
          totalSkipped++;
        }
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total records processed: ${totalProcessed}`);
    console.log(`Updated existing attendees: ${totalUpdated}`);
    console.log(`Created new attendees: ${totalInserted}`);
    console.log(`Skipped (duplicates/errors): ${totalSkipped}`);
    console.log('='.repeat(60));

    if (totalUpdated > 0 || totalInserted > 0) {
      console.log('🎉 Process completed successfully!');
      if (totalUpdated > 0) {
        console.log(`✨ ${totalUpdated} existing attendees now have piime_id`);
      }
      if (totalInserted > 0) {
        console.log(`➕ ${totalInserted} new attendees created`);
      }
    } else {
      console.log('ℹ️  No changes were made.');
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(
        '❌ File not found. Please ensure the xlsx file exists at:'
      );
      console.log('   scripts/insert_attendees_xlsx/grid.xlsx');
    } else {
      console.error('❌ Error processing file:', error.message);
    }
  }
}

// Instructions
console.log('📖 Attendees Import & Update Script');
console.log('='.repeat(60));
console.log(
  'This script reads an Excel file and manages attendees in InstantDB'
);
console.log('');
console.log('Expected file location: scripts/insert_attendees_xlsx/grid.xlsx');
console.log('');
console.log('Excel columns mapping:');
console.log('- "Nombre" → name');
console.log('- "Apellido paterno" → first_lastname');
console.log('- "Apellido materno" → second_lastname');
console.log('- "ID Asistente" → piime_id');
console.log('');
console.log('The script will:');
console.log('1. Find existing attendees WITHOUT piime_id');
console.log('2. Match them by name with Excel records (90%+ similarity)');
console.log('3. UPDATE existing records with piime_id if match found');
console.log('4. CREATE new attendees if no match found');
console.log('5. Skip if piime_id already exists');
console.log('');
console.log('🔍 Fuzzy matching features:');
console.log('- Uses Levenshtein distance algorithm');
console.log('- Handles typos, missing accents, extra spaces');
console.log(`- Minimum similarity threshold: ${SIMILARITY_THRESHOLD}%`);
console.log('='.repeat(60));
console.log('');

insertAttendeesFromXlsx();

import { SQLiteDatabase } from 'expo-sqlite';

export const initDatabase = async (db: SQLiteDatabase) => {
  try {
    // return await db.execAsync(`PRAGMA user_version = 0;`)
    // Always sync libSQL first to prevent conflicts between local and remote databases
    db.syncLibSQL();
  } catch (e) {
    console.log('Error onInit syncing libSQL:', e);
  }

  // Define the target database version.
  const DATABASE_VERSION = 1;

  // PRAGMA is a special command in SQLite used to query or modify database settings. For example, PRAGMA user_version retrieves or sets a custom schema version number, helping you track migrations.
  // Retrieve the current database version using PRAGMA.
  let result = await db.getFirstAsync<{
    user_version: number;
  } | null>('PRAGMA user_version');
  console.log(result);
  let currentDbVersion = result?.user_version ?? 0;
  console.log('Current DB version:', currentDbVersion);

  // If the current version is already equal or newer, no migration is needed.
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   console.log('No migration needed, DB version:', currentDbVersion);
  //   return;
  // }

  // For a new or uninitialized database (version 0), apply the initial migration.
  if (currentDbVersion === 0) {
    // Note: libSQL does not support WAL (Write-Ahead Logging) mode.
    // await db.execAsync(`PRAGMA journal_mode = 'wal';`);
    console.log('Applying initial migration...');
    await db.execAsync(
      `
      CREATE TABLE IF NOT EXISTS attendees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        first_lastname TEXT NOT NULL,
        second_lastname TEXT NOT NULL,
        piime_id TEXT,
        active BOOLEAN NOT NULL DEFAULT 1,
        created TEXT NOT NULL,
        updated TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT 1,
        created TEXT NOT NULL,
        updated TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event INTEGER NOT NULL,
        attendee INTEGER NOT NULL,
        created TEXT NOT NULL,
        updated TEXT NOT NULL,
        FOREIGN KEY (event) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (attendee) REFERENCES attendees(id) ON DELETE CASCADE
      );
    `
    );
    console.log('Initial migration applied, DB version:', DATABASE_VERSION);
    // Update the current version after applying the initial migration.
    currentDbVersion = 1;
  } else {
    console.log('DB version:', currentDbVersion);
  }

  // Future migrations for later versions can be added here.
  // Example:
  // if (currentDbVersion === 1) {
  //   // Add migration steps for upgrading from version 1 to a higher version.
  // }

  // Set the database version to the target version after migration.
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  await db.syncLibSQL();
};

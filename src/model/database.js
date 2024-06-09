import * as SQLite from 'expo-sqlite';

const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('schedule-app-sqlite.db');

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS schedules (
      id_mata_kuliah TEXT PRIMARY KEY NOT NULL,
      mata_kuliah TEXT NOT NULL,
      nama_kelas TEXT NOT NULL,
      sks INTEGER NOT NULL,
      hari TEXT NOT NULL,
      jam_mulai TEXT NOT NULL,
      jam_selesai TEXT NOT NULL,
      ruangan TEXT NOT NULL,
      user TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS token (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_token TEXT
    );`
  );

  return db
}

export default dbPromise = openDatabase();


// Delete SQLite database
/* import * as FileSystem from 'expo-file-system';
const dbDir = FileSystem.documentDirectory + 'SQLite';
const dbDirInfo = await FileSystem.getInfoAsync(dbDir);

if (!dbDirInfo.exists) {
  console.log('SQLite directory does not exist.');
  return [];
}
const files = await FileSystem.readDirectoryAsync(dbDir);
console.log('Databases:', files);

const dbName = '...';
const dbPath = FileSystem.documentDirectory + `SQLite/${dbName}`;
await FileSystem.deleteAsync(dbPath, { idempotent: true });
console.log(`Database ${dbName} deleted.`); */
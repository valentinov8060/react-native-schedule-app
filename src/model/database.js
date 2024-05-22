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

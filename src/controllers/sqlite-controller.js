import dbPromise from '../model/connectDB';

import {
  authentication
} from './server-controller';

const getSchedules = async () => {
  try {
    const db = await dbPromise;
    const schedules = await db.getAllAsync('SELECT * FROM schedules')
    return schedules
  } catch (error) {
    throw new Error(`Failed to get schedules from SQLite: ${error.message || error}`);
  }
}

const insertSchedules = async (schedules) => {
  try {
    const db = await dbPromise;
    await db.execAsync(`DELETE FROM schedules`);
    schedules.forEach(async e => {
      const { id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user } = e;
      await db.runAsync(
        `
          INSERT INTO schedules (
            id_mata_kuliah,
            mata_kuliah,
            nama_kelas,
            sks,
            hari,
            jam_mulai,
            jam_selesai,
            ruangan,
            user
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, 
        [id_mata_kuliah, mata_kuliah, nama_kelas, sks, hari, jam_mulai, jam_selesai, ruangan, user]
      );
    });
  } catch (error) {
    throw new Error(`Failed to insert schedules to SQLite: ${error.message || error}`);
  }
}

const insertToken = async (token) => {
  try {
    const db = await dbPromise;
    await db.runAsync(`UPDATE token SET user_token = ? WHERE id = 1`, [token]);
  } catch (error) {
    throw new Error(`Failed to insert token to SQLite: ${error.message || error}`);
  }
}

const checkToken = async () => {
  try {
    const db = await dbPromise;
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check token
    await Promise.race([
      authentication(token),
      new Promise((resolve, reject) => 
        setTimeout(() => reject(new Error('Cannot connect to server')), 5000)
      )
    ]);
    return token
  } catch (error) {
    removeToken();
    throw new Error(`Authentication failed: ${error.message || error}`);
  }
}

const removeToken = async () => {
  try {
    const db = await dbPromise;
    await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1]);
  } catch (error) {
    throw new Error(`Failed to remove token from SQLite: ${error.message || error}`);
  }
}

export {
  getSchedules,
  insertSchedules,
  insertToken,
  checkToken,
  removeToken
}
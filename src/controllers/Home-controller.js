import dbPromise from '../model/database';

const getSchedulesOnFirstLoad = async (setLoadSchedules) => {
  try {
    const db = await dbPromise;
    const result = await db.getAllAsync('SELECT * FROM schedules')
    setLoadSchedules(result)
  } catch (error) {
    console.log(error)
  }
}

const refreshButton = async (setSchedules) => {
  try {
    // Fetch data from server 2 seconds timeout
    const timeout = new Promise((resolve, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), 2000)
    );
    const response = await Promise.race([
      fetch('http://192.168.1.19:3000/schedule/list'),
      timeout
    ]);
    // Check if the response is not okay (non-200 status code)
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
    }
    const json = await response.json();
    const data = json.data;
    // Check if the response is not valid
    if (!data || !Array.isArray(json.data)) {
      throw new Error('Invalid data format received from server');
    }
    setSchedules(data);
    console.log('Fetch success');

    // Insert data to SQLite
    console.log('Inserting data to SQLite');
    const db = await dbPromise;
    await db.execAsync(`DELETE FROM schedules`);
    data.forEach(async e => {
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
    console.log('Data successfully inserted to SQLite');

  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }

    // Load data from SQLite if fetch failed
    console.log("Attempting to load data from SQLite");
    const db = await dbPromise;
    const result = await db.getAllAsync('SELECT * FROM schedules');
    setSchedules(result);
    console.log('Loaded from SQLite success');
  }
}

export {
  getSchedulesOnFirstLoad,
  refreshButton
}
import dbPromise from '../model/connectDB';

const apiUrl = process.env.API_URL;

const getSchedulesOnFirstLoad = async (setLoadSchedules) => {
  try {
    const db = await dbPromise;
    const schedules = await db.getAllAsync('SELECT * FROM schedules')
    setLoadSchedules(schedules)
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
  }
}

const refreshButton = async (setSchedules) => {
  try {
    /* console.log('apiUrl: ', apiUrl); */
    // Fetch data from server
    const response = await fetch(`${apiUrl}schedule/list`);
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
    data.forEach(e => {
      e.jam_mulai = e.jam_mulai.substring(0, 5)
      e.jam_selesai = e.jam_selesai.substring(0, 5)
    });
    setSchedules(data);
    console.log('Fetch schedule success');

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
    const schedules = await db.getAllAsync('SELECT * FROM schedules');
    setSchedules(schedules);
  }
}

export {
  getSchedulesOnFirstLoad,
  refreshButton
}
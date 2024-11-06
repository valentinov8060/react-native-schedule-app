import {
  getSchedules,
  insertSchedules,
} from '../controllers/sqlite-controller';
import {
  scheduleList,
} from '../controllers/server-controller';

// view services
const getSchedulesOnFirstLoad = async (setLoadSchedules) => {
  try {
    const schedules = await getSchedules();
    setLoadSchedules(schedules)
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
  }
}

// button service
const refreshButton = async (setSchedules) => {
  try {
    // Fetch data from server
    const schedules = await scheduleList();

    // Formating data
    schedules.forEach(e => {
      e.jam_mulai = e.jam_mulai.substring(0, 5)
      e.jam_selesai = e.jam_selesai.substring(0, 5)
    });
    setSchedules(schedules);
    console.log('Fetch schedule success');

    // Insert data to SQLite
    await insertSchedules(schedules);
    console.log('Data successfully inserted to SQLite');

  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
    // Load data from SQLite if fetch failed
    console.log("Attempting to load data from SQLite");
    const schedules = await getSchedules();
    setSchedules(schedules);
  }
}

export {
  getSchedulesOnFirstLoad,
  refreshButton
}
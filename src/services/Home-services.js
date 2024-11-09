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

const schedulesPage = (schedules, page, schedulePerPage) => {
  if (page <= 0 || Math.ceil(schedules.length / schedulePerPage) < page) {
    console.error("Invalid page number");
    return;
  }
  const startIndex = (page - 1) * schedulePerPage;
  return schedules.slice(startIndex, startIndex + schedulePerPage);
}

// button service
const getSchedulesFromServerButton = async (setSchedules, setGetSchedulesErrorMessage) => {
  try {
    // Fetch data from server
    const schedules = await scheduleList();

    // Formating data
    schedules.forEach(e => {
      e.jam_mulai = e.jam_mulai.substring(0, 5)
      e.jam_selesai = e.jam_selesai.substring(0, 5)
    });
    console.log('Fetch schedule success');

    // Insert data to SQLite
    await insertSchedules(schedules);
    setGetSchedulesErrorMessage('')
    console.log('Data successfully inserted to SQLite');

  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
    setGetSchedulesErrorMessage('Cannot connect to server')
  } finally {
    // Load data from SQLite
    console.log("Attempting to load data from SQLite");
    const schedules = await getSchedules();
    setSchedules(schedules);
  }
}

const nextPageScheduleButton = (setAmountPage, amountPage, setPage, page, schedules, schedulePerPage) => {
  setAmountPage(Math.ceil(schedules.length / schedulePerPage));
  if (page == amountPage) {
    return;
  }
  setPage(page => page + 1);
}

const previousPageScheduleButton = (setPage, page) => {
  if (page == 1) {
    return;
  }
  setPage(page => page - 1);
}

export {
  getSchedulesOnFirstLoad,
  schedulesPage,
  getSchedulesFromServerButton,
  nextPageScheduleButton,
  previousPageScheduleButton
}
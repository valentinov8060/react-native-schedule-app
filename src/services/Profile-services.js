import { Alert } from 'react-native';

import { jwtDecode } from "jwt-decode";

import {
  insertToken,
  checkToken,
  removeToken
} from '../controllers/sqlite-controller';
import {
  login,
  scheduleCreate,
  scheduleUpdate,
  scheduleRemove,
  scheduleUser
} from '../controllers/server-controller';

// view services
const checkTokenOnLoad = async (setLoginPage) => {
  try {
    await checkToken();
    setLoginPage(false);
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
    setLoginPage(true);
  }
}

const getUserSchedules = async (setUserSchedules) => {
  try {
    const token = await checkToken();

    // Get user from decoded token
    const user = jwtDecode(token).user;

    // Fetch data from server
    const userSchedules = await scheduleUser(user);

    // Formating data
    userSchedules.forEach(e => {
      e.jam_mulai = e.jam_mulai.substring(0, 5)
      e.jam_selesai = e.jam_selesai.substring(0, 5)
    });
    console.log('Fetch user schedule success');

    setUserSchedules(userSchedules);
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
  }
}

// button services
const loginButton = async (reqBody, setLoginPage, setLoginErrorMessage) => {
  try {
    await removeToken();
    // Login from server 5 seconds timeout
    const response = await Promise.race([
      login(reqBody),
      new Promise((resolve, reject) => 
        setTimeout(() => reject(new Error('Cannot connect to server')), 5000)
      )
    ]);
    const token = response.token;

    // Save token to SQLite
    await insertToken(token);
    await checkToken();
    console.log('Login success');

    setLoginErrorMessage('');
    setLoginPage(false);
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }

    if (error.message !== 'Cannot connect to server') {
      setLoginErrorMessage('username or password is wrong');
    } else {
      setLoginErrorMessage('Cannot connect to server');
    }
    setLoginPage(true);
  }
}

const logoutButton = async (setLoginPage) => {
  try {
    await removeToken();
    console.log('Logout success');
    setLoginPage(true)
  } catch {
    if (error.message) {
      console.error('Error: ', error.message);
    } else { 
      console.error('An error occurred: ', error);
    }
  }
}

const submitButton = async (reqBody, setInputModalVisible, setReqBodyScheduleCreate) => {
  // Form validation
  const { mata_kuliah, nama_kelas, sks, hari, ruangan, jam_mulai, jam_selesai } = reqBody;
  const isFormComplete = mata_kuliah && nama_kelas && sks && hari && jam_mulai && jam_selesai && ruangan;
  if (!isFormComplete) {
    Alert.alert("Semua input harus diisi!");
    return;
  }

  try {
    const token = await checkToken();

    // Create schedule on server 
    const response = await scheduleCreate(token, reqBody);
    console.log('Create schedule success: ', response);
    setInputModalVisible(false);
    Alert.alert("Jadwal berhasil ditambahkan!");
    setReqBodyScheduleCreate({});
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error);
    } else {
      console.error('An error occurred: ', error);
    }
    Alert.alert(`${error.message}`);
  }
}

const deleteButton = async (id_mata_kuliah) => {
  try {
    const token = await checkToken();

    // Delete schedule on server
    await scheduleRemove(token, id_mata_kuliah);
    console.log('Delete schedule success');
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
  }
}

const editButton = async (reqBody, id_mata_kuliah, setEditModalVisible) => {
  try {
    const token = await checkToken();

    // Update schedule on server
    await scheduleUpdate(token, id_mata_kuliah, reqBody);
    setEditModalVisible(false);
    Alert.alert("Jadwal berhasil diubah!");
    console.log('Update schedule success');
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
    Alert.alert(`${error.message}`);
  }
}

export {
  checkTokenOnLoad,
  getUserSchedules,
  loginButton,
  logoutButton,
  submitButton,
  deleteButton,
  editButton
}
import { jwtDecode } from "jwt-decode";

import {
  insertToken,
  checkToken,
  removeToken
} from '../controllers/sqlite-controller';
import {
  login,
  scheduleCreate,
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
        setTimeout(() => reject(new Error('Timeout: Cannot connect to server')), 5000)
      )
    ]);
    const token = response.token;

    // Save token to SQLite
    await insertToken(token);
    await checkToken();
    console.log('Login success, token: ', token);

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

const submitButton = async (reqBody, setModalVisible) => {
  try {
    const token = await checkToken();

    // Create schedule on server 
    const response = await scheduleCreate(token, reqBody);
    console.log('Create schedule success: ', response);
    setModalVisible(false);
  } catch (error) {
    if (error.message) {
      console.error('Error: ', error.message);
    } else {
      console.error('An error occurred: ', error);
    }
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

export {
  checkTokenOnLoad,
  getUserSchedules,
  loginButton,
  logoutButton,
  submitButton,
  deleteButton
}
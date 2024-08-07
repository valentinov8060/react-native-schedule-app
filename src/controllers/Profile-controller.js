import { jwtDecode } from "jwt-decode";

import dbPromise from '../model/connectDB';

const apiUrl = process.env.API_URL;

const checkTokenOnLoad = async (setLoginPage) => {
  try {
    /* console.log("apiUrl: ", apiUrl); */
    const db = await dbPromise;
    // Get token from SQLite
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1])
      throw new Error('Token has expired');
    }
    setLoginPage(false);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
    setLoginPage(true);
  }
}

const loginButton = async (reqBody, setLoginPage, setLoginErrorMessage) => {
  try {
    const db = await dbPromise;
    // Login from server 2 seconds timeout
    const timeout = new Promise((resolve, reject) => 
      setTimeout(() => reject(new Error('Cannot connect to server')), 5000)
    );
    const response = await Promise.race([
      fetch(`${apiUrl}user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: reqBody.user,
          password: reqBody.password
        }),
      }),
      timeout
    ]);
    const json = await response.json();

    // Check if the response is not okay (non-200 status code)
    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}: ${json.error}`);
    } 
    const token = json.data;
    // Check if the response is not valid
    if (!token) {
      throw new Error('Invalid data format received from server');
    }
    console.log('Login success, token: ', token);

    // Save token to SQLite
    await db.runAsync('INSERT OR REPLACE INTO token (id, user_token) VALUES (1, ?);', [token]);

    setLoginPage(false);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
      setLoginErrorMessage(error.message);
    }
    setLoginPage(true);
  }
}

const logoutButton = async (setLoginPage) => {
  try {
    const db = await dbPromise;
    await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1])
    console.log('Logout success');
    setLoginPage(true)
  } catch {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
  }
}

const submitButton = async (reqBody, setModalVisible) => {
  try {
    const db = await dbPromise;
    // Get token from SQLite
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1])
      throw new Error('Token has expired');
    }

    // Create schedule on server 
    const response = await fetch(`${apiUrl}schedule/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({
        mata_kuliah: reqBody.mata_kuliah,
        nama_kelas: reqBody.nama_kelas,
        sks: reqBody.sks,
        hari: reqBody.hari,
        jam_mulai: reqBody.jam_mulai,
        jam_selesai: reqBody.jam_selesai,
        ruangan: reqBody.ruangan,
      }),
    })

    const json = await response.json();
    // Check if the response is not okay (non-200 status code)
    if (!response.ok) {
      throw new Error(`Create schedule failed with status ${response.status}: ${json.error}`);
    } 
    console.log('Create schedule success: ', json.data);
    setModalVisible(false);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
  }
}

const getUserSchedules = async (setUserSchedules) => {
  try {
    const db = await dbPromise;
    // Get token from SQLite
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1])
      throw new Error('Token has expired');
    }

    // Get user from decoded token
    const user = decoded.user;
    console.log('User: ', user);
    // Fetch data from server
    const response = await fetch(`${apiUrl}schedule/user/${user}`);
    // Check if the response is not okay (non-200 status code)
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}: ${response}`);
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
    setUserSchedules(data);
    console.log('Fetch user schedule success');

  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
  }
}

const deleteButton = async (id_mata_kuliah) => {
  try {
    const db = await dbPromise;
    // Get token from SQLite
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      await db.runAsync('UPDATE token SET user_token = ? WHERE id = ?', [null, 1])
      throw new Error('Token has expired');
    }

    // Delete schedule on server
    const response = await fetch(`${apiUrl}schedule/remove/${id_mata_kuliah}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    })
    // Check if the response is not okay (non-200 status code)
    if (!response.ok) {
      throw new Error(`Delete failed with status ${response.status}: ${response}`);
    }
    const json = await response.json();
    console.log('Delete success: ', json.data);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
  }
}

export {
  checkTokenOnLoad,
  loginButton,
  logoutButton,
  submitButton,
  getUserSchedules,
  deleteButton
}
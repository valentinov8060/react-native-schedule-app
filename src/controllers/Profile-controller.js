import { jwtDecode } from "jwt-decode";

import dbPromise from '../model/connectDB';

const apiUrl = process.env.API_URL;

const checkTokenOnLoad = async (setLoginPage) => {
  try {
    const db = await dbPromise;
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;

    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error('Token has expired');
    }
    setLoginPage(false);
    console.log(apiUrl);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
    setLoginPage(true);
  }
}

const loginButton = async (user, password, setLoginPage, setErrorMessage) => {
  try {
    const db = await dbPromise;
    // Login from server 2 seconds timeout
    const timeout = new Promise((resolve, reject) => 
      setTimeout(() => reject(new Error('Cannot connect to server')), 2000)
    );
    const response = await Promise.race([
      fetch(`${apiUrl}user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          password,
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
    console.log('Login success: ', token);

    // Save token to SQLite
    await db.runAsync('INSERT OR REPLACE INTO token (id, user_token) VALUES (1, ?);', [token]);

    setLoginPage(false);
    console.log('Login success');
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
      setErrorMessage(error.message);
    }
    setLoginPage(true);
  }
}

/* const userSchedules = async (setUserSchedule, setLoginPage) => {
  try {
    const db = await dbPromise;
    const getToken = await db.getFirstAsync('SELECT user_token FROM token;');
    const token = getToken.user_token;
    // Check if token is not found
    if (!token) {
      throw new Error('Token not found');
    }
    // Check if token is expired
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error('Token has expired');
    }
    setLoginPage(false);
    const user = decoded.user;

    // Fetch data from server
    const response = await fetch(`http://192.168.1.19:3000/schedule/user/${user}`);
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
    setUserSchedule(data);
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Error TypeError: ', error);
    } else {
      console.error('An error occurred: ', error.message);
    }
    setLoginPage(true);
  }
} */

export {
  checkTokenOnLoad,
  loginButton,
}
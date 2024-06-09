import dbPromise from '../model/database';

const loginButton = async (user, password) => {
  try {
    const response = await fetch('http://192.168.1.19:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO token (user_token) VALUES (?);`, 
      [data.token]
    );


  } catch (error) {
    console.log(error)
  }
}
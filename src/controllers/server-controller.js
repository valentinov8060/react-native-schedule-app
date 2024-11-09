const apiUrl = process.env.API_URL;

const login = async (reqBody) => {
  console.log(apiUrl);
  try {
    const response = await fetch(`http://${apiUrl}:3000/user/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: reqBody.user,
          password: reqBody.password
        }),
      }
    )
    const json = await response.json();
    const data = json.data;

    if (!response.ok) { 
      throw new Error(json.error || 'Login failed');
    }    
    return data
  } catch (error) {
    throw new Error(`Failed login: ${error.message || error}`);
  }
};

const authentication = async (token) => {
  try {
    const response = await fetch(`http://${apiUrl}:3000/user/authentication`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      }
    )

    if (!response.ok) { 
      const json = await response.json();
      const error = json.error;
      throw new Error(error || 'Authentication failed');
    } 
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message || error}`);
  }
};

const scheduleCreate = async (token, reqBody) => {
  try {
    const response = await fetch(`http://${apiUrl}:3000/schedule/create`, {
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

    if (!response.ok) { 
      const json = await response.json();
      const error = json.error;
      throw new Error(error || 'Failed to create schedule');
    }
  } catch (error) {
    throw new Error(`Failed to create schedule: ${error.message || error}`);
  }
}

const scheduleRemove = async (token, id_mata_kuliah) => {
  try {
    const response = await fetch(`http://${apiUrl}:3000/schedule/remove/${id_mata_kuliah}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    })

    if (!response.ok) { 
      const json = await response.json();
      const error = json.error;
      throw new Error(error || 'Failed to remove schedule');
    }
  } catch (error) {
    throw new Error(`Failed to remove schedule: ${error.message || error}`);
  }
}

const scheduleList = async () => {
  try {
    const response = await fetch(`http://${apiUrl}:3000/schedule/list`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const json = await response.json();
    const data = json.data;

    if (!response.ok) { 
      throw new Error(json.error || 'Failed to get schedules list');
    }
    return data
  } catch (error) {
    throw new Error(`Failed to get schedules list: ${error.message || error}`);
  }
};

const scheduleUser = async (user) => {
  try {
    const response = await fetch(`http://${apiUrl}:3000/schedule/user/${user}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const json = await response.json();
    const data = json.data;

    if (!response.ok) { 
      throw new Error(json.error || 'Failed to get user schedule');
    }
    return data
  } catch (error) {
    throw new Error(`Failed to get user schedule: ${error.message || error}`);
  }
}

export {
  login,
  authentication,
  scheduleCreate,
  scheduleRemove,
  scheduleList,
  scheduleUser
};
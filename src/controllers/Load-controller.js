import dbpromise from '../model/database'

const loadPage = async (setSchedules) => {
  try {
    const db = await dbpromise
    const result = await db.getAllAsync('SELECT * FROM schedules')
    setSchedules(result)
  } catch (error) {
    console.log(error)
  }
}

export {
  loadPage
}
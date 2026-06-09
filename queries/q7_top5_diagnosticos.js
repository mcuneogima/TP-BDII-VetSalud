import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getTop5Diagnosticos() {

  const db = getDB()

  return db.collection('consultas').aggregate([
    {
      $group: {
        _id: '$diagnostico',
        frecuencia: { $sum: 1 }
      }
    },
    {
      $sort: { frecuencia: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        diagnostico: '$_id',
        frecuencia: 1,
        _id: 0
      }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getTop5Diagnosticos()) })
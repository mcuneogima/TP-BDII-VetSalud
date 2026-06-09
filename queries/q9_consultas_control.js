import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getConsultasControlBaratas() {

  const db = getDB()

  return db.collection('consultas')
    .find(
      {
        motivo: { $regex: /control/i },
        costo: { $lt: 5000 }
      },
      {
        projection: {
          _id: 1,
          id_paciente: 1,
          id_vet: 1,
          fecha: 1,
          motivo: 1,
          diagnostico: 1,
          costo: 1
        }
      }
    )
    .toArray()
}

withMongo(async () => { console.log(await getConsultasControlBaratas()) })
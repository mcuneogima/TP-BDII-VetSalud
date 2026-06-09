import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getConsultasSeguimiento() {

  const db = getDB()

  return db.collection('consultas').aggregate([
    {
      $match: { estado: 'Seguimiento' }
    },
    {
      $lookup: {
        from: 'veterinarios',
        localField: 'id_vet',
        foreignField: '_id',
        as: 'veterinario'
      }
    },
    {
      $unwind: '$veterinario'
    },
    {
      $project: {
        _id: 1,
        id_paciente: 1,
        fecha: 1,
        motivo: 1,
        diagnostico: 1,
        costo: 1,
        estado: 1,
        veterinario: {
          nombre: 1,
          apellido: 1,
          matricula: 1,
          especialidad: 1
        }
      }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getConsultasSeguimiento()) })
import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getPacientesActivos() {

  const db = getDB()

  return db.collection('pacientes').aggregate([
    {
      $match: { activo: true }
    },
    {
      $lookup: {
        from: 'propietarios',
        localField: 'id_propietario',
        foreignField: '_id',
        as: 'propietario'
      }
    },
    {
      $unwind: '$propietario'
    },
    {
      $project: {
        nombre: 1,
        especie: 1,
        raza: 1,
        fecha_nac: 1,
        propietario: {
          nombre: 1,
          apellido: 1,
          dni: 1,
          email: 1,
          telefono: 1,
          ciudad: 1,
          provincia: 1
        }
      }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getPacientesActivos()) })
import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getPropietariosConMultiplesPacientes() {

  const db = getDB()

  return db.collection('pacientes').aggregate([
    {
      $group: {
        _id: '$id_propietario',
        cantidad_pacientes: { $sum: 1 },
        pacientes: { $push: '$nombre' }
      }
    },
    {
      $match: { cantidad_pacientes: { $gt: 1 } }
    },
    {
      $lookup: {
        from: 'propietarios',
        localField: '_id',
        foreignField: '_id',
        as: 'propietario'
      }
    },
    {
      $unwind: '$propietario'
    },
    {
      $project: {
        cantidad_pacientes: 1,
        pacientes: 1,
        'propietario.nombre': 1,
        'propietario.apellido': 1,
        'propietario.email': 1
      }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getPropietariosConMultiplesPacientes()) })
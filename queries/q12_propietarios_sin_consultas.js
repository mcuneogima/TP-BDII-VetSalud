import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getPropietariosSinConsultas() {

  const db = getDB()
  const yearAgo = new Date()  
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  return db.collection('pacientes').aggregate([
    {
      $lookup: {
        from: 'consultas',
        let: { idPaciente: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $gte: ['$fecha', yearAgo] }, 
                  { $eq: ['$id_paciente', '$$idPaciente'] }
                ]
              }
            }
          },
          {
            $limit: 1
          }
        ],
        as: 'consulta'
      }
    },{
      $match: {
        'consulta.0': { $exists: false }
      }
    },
    {
      $group: { _id: '$id_propietario' }
    },{
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
      $replaceRoot: { newRoot: '$propietario' }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getPropietariosSinConsultas()) })
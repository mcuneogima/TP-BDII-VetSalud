import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getVeterinariosActivosConConsultas() {

  const db = getDB()

  const hace60Dias = new Date()
  hace60Dias.setDate(hace60Dias.getDate() - 60)

  return db.collection('veterinarios').aggregate([
    {
      $match: { activo: true }
    },
    {
      $lookup: {
        from: 'consultas',
        let: { idVet: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$id_vet', '$$idVet'] },
              fecha: { $gte: hace60Dias }
            }
          }
        ],
        as: 'consultas_recientes'
      }
    },
    {
      $project: {
        nombre: 1,
        apellido: 1,
        especialidad: 1,
        sucursal: 1,
        cantidad_consultas: { $size: '$consultas_recientes' }
      }
    }
  ]).toArray()
}

withMongo(async () => { console.log(await getVeterinariosActivosConConsultas()) })
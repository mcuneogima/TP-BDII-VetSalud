import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getPacientesPorSucursal(sucursal) {

  const db = getDB()

  return db.collection('veterinarios').aggregate([
    {
      $match: { sucursal, activo: true }
    },
    {
      $lookup: {
        from: 'consultas',
        localField: '_id',
        foreignField: 'id_vet',
        as: 'consultas'
      }
    },
    {
      $unwind: '$consultas'
    },
    {
      $group: {
        _id: '$consultas.id_paciente'
      }
    },
    {
      $lookup: {
        from: 'pacientes',
        localField: '_id',
        foreignField: '_id',
        as: 'paciente'
      }
    },
    {
      $unwind: '$paciente'
    },
    {
      $replaceRoot: { newRoot: '$paciente' }
    }
  ]).toArray()
}

const args = process.argv.slice(2)
const sucursal = args[0]?.trim()

if (!sucursal) {
  console.error('Uso: node q10_pacientes_por_sucursal.js <sucursal>')
  console.error('Ejemplo: node q10_pacientes_por_sucursal.js Palermo')
  process.exit(1)
}

// Sanitización: solo letras, espacios y guiones, máximo 50 chars
if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(sucursal)) {
  console.error('Nombre de sucursal inválido.')
  process.exit(1)
}

withMongo(async () => { console.log(await getPacientesPorSucursal(sucursal)) })
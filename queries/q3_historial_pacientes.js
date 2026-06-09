import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getHistorialPaciente(idPaciente) {

  const db = getDB()

  // Consultas del paciente desde colección separada
  const consultas = await db.collection('consultas')
    .find({ id_paciente: idPaciente })
    .sort({ fecha: 1 })
    .toArray()

  // Vacunaciones embebidas en el documento del paciente
  const paciente = await db.collection('pacientes')
    .findOne({ _id: idPaciente })

  if (!paciente) return null

  const vacunaciones = (paciente.vacunaciones || [])
    .sort((a, b) => a.fecha_aplicacion - b.fecha_aplicacion)

  // Merge y ordenar por fecha unificada
  const historial = [
    ...consultas.map(c => ({
      tipo: 'consulta',
      fecha: c.fecha,
      detalle: c
    })),
    ...vacunaciones.map(v => ({
      tipo: 'vacunacion',
      fecha: v.fecha_aplicacion,
      detalle: v
    }))
  ].sort((a, b) => a.fecha - b.fecha)

  return { paciente: paciente.nombre, historial }
}

const args = process.argv.slice(2)
const idPaciente = args[0]?.trim()

if (!idPaciente) {
  console.error('Uso: node q3_historial_paciente.js <id_paciente>')
  console.error('Ejemplo: node q3_historial_paciente.js P001')
  process.exit(1)
}

withMongo(async () => { console.log(await getHistorialPaciente(idPaciente)) })
import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'
export async function nuevaConsulta(_id, id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado) {
    const db = getDB()
    const veterinario = await db.collection('veterinarios').findOne({ _id: id_vet })
    if (!veterinario) {
        console.error('Veterinario no encontrado con id:', id_vet)
        return null
    }
    const paciente = await db.collection('pacientes').findOne({ _id: id_paciente })
    if (!paciente) {
        console.error('Paciente no encontrado con id:', id_paciente)
        return null
    }
    const result = await db.collection('consultas').insertOne(
        { _id, id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado }
    )
    return result.acknowledged ? { _id, id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado } : null
}

const args = process.argv.slice(2)
const _id = args[0]?.trim()
const id_paciente = args[1]?.trim()
const id_vet = args[2]?.trim()
const fecha = args[3]?.trim()
const motivo = args[4]?.trim()
const diagnostico = args[5]?.trim()
const costo = args[6]?.trim()
const estado = args[7]?.trim()

if (!_id || !id_paciente || !id_vet || !fecha || !motivo || !diagnostico || !costo || !estado) {
  console.error('Uso: node q14_nueva_consulta.js <_id> <id_paciente> <id_vet> <fecha> <motivo> <diagnostico> <costo> <estado>')
  console.error('Ejemplo: node q14_nueva_consulta.js C001 P001 V001 2023-10-10 Consulta de rutina Diagnóstico de rutina 100.00 En proceso')
  process.exit(1)
}

// Sanitización: solo letras, espacios y guiones, máximo 50 chars
if (!/^CON[0-9]{3}$/.test(_id) ||
    !/^P[0-9]{3}$/.test(id_paciente) ||
    !/^V[0-9]{3}$/.test(id_vet) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(motivo) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(diagnostico) ||
    !/^[0-9]{1,16}$/.test(costo) ||
    !/^(Cerrada|Seguimiento)$/.test(estado)) {
  console.error('Datos de la consulta inválidos.')
  process.exit(1)
}

try{ Date.parse(fecha) } catch (err) {
  console.error('Fecha inválida. Use formato YYYY-MM-DD.')
  process.exit(1)
}

withMongo(async () => { console.log(await nuevaConsulta(_id, id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado)) })
import {readCsv} from '../../utils/csv.js';
import {redisClient} from '../../config/db.js'
import Veterinario from '../../models/Veterinario.js'
import Paciente from '../../models/Paciente.js'

export async function getAppointmentById(periodo, id_vet) {
    const appointment = await redisClient.hGet(`stats:ingresos:${periodo}:${id_vet}`);

    if (Object.keys(appointment).length === 0) {
        return null;
    }

    return appointment;
}

export async function createNewAppointment(id_consulta, id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado) {
    const veterinarioExists = await Veterinario.findOne({id_vet: id_vet})
    const pacienteExists = await Paciente.findOne({id_paciente: id_paciente})

    if (!veterinarioExists || !pacienteExists) {
        throw new Error(`Veterinario con ID ${id_vet} o paciente con ID ${id_paciente} no encontrado`)
    }

    const periodo = `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`

    const created1 = await redisClient.incrBy(`stats:ingresos:${periodo}:${id_vet}`,
        Number(costo)
    )

    const created2 = await redisClient.sAdd(`appointment:${fecha.getUTCFullYear()}`, id_paciente)

    const created3 = await redisClient.sAdd(`appointment:ids`, id_consulta)

    return [created1, created2]
}

export async function importAppointmentsFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewAppointment(
            row.id_consulta,
            row.id_paciente,
            row.id_vet,
            new Date(row.fecha),
            row.motivo,
            row.diagnostico,
            row.costo,
            row.estado
        ).catch(err => console.error(`Failed to import appointment ${row.id_consulta}: ${err.message}`))
    )

    await Promise.allSettled(promises)
}


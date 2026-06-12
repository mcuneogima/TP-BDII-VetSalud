import {createNewAppointment} from "../repository/appointment-queries.js";
import Propietario from "../../models/Propietario.js";

/**
 * Creates a new appointment.
 * @param {string} id_paciente - The patient's ID.
 * @param {string} id_vet - The vet's ID.
 * @param {Date} fecha - The date of the appointment.
 * @param {string} motivo - The reason for the appointment.
 * @param {string} diagnostico - The diagnosis.
 * @param {number} costo - The cost of the appointment.
 * @param {string} estado - The status of the appointment.
 */
export async function createAppointment(id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado) {
    const id_consulta = await getNextAppointmentIdNumber()
    const newAppointment = await createNewAppointment('C00123', id_paciente, id_vet, fecha, motivo, diagnostico, costo, estado)
    return newAppointment
}

async function getNextAppointmentIdNumber() {
    const lastOwnerId = await Appoint
        .find({})
        .sort({id_propietario: -1})
        .limit(1)
        .select('id_propietario')
        .lean()

    if (lastOwnerId.length > 0) {
        const numericPartString = lastOwnerId[0].id_propietario.replace(/[^0-9]/g, '');
        const lastId = parseInt(numericPartString, 10);
        return 'C' + String(lastId + 1).padStart(3, '0');
    }
    return 'C001'
}
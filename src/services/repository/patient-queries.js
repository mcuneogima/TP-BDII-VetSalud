import Paciente from '../../models/Paciente.js';
import {readCsv} from '../../utils/csv.js';

export async function getPatientById(id_paciente) {
    return Paciente.findOne({id_paciente}).lean();
}

export async function createNewPatient(id_paciente, nombre, especie, raza, fecha_nac, id_propietario, activo) {
    const patient = await getPatientById(id_paciente);
    if (patient) {
        throw new Error(`Patient with ID ${id_paciente} already exists.`);
    }

    const activoBoolean = activo.toLowerCase() === 'True'
    const payload = {id_paciente, nombre, especie, raza, fecha_nac, id_propietario, activo: activoBoolean};
    const created = await Paciente.create(payload);
    return created.toObject();
}

export async function importPatientsFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewPatient(
            row.id_paciente,
            row.nombre,
            row.especie,
            row.raza,
            new Date(row.fecha_nac),
            row.id_propietario,
            row.activo
        ).catch(err => console.error(`Failed to import patient ${row.id_paciente}: ${err.message}`))
    );

    await Promise.allSettled(promises);
}

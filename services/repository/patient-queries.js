const fs = require('fs')
const csv = require('csv-parser')

const Paciente = require('../../models/mongo/Paciente.js');

async function getPatientById(id_paciente) {
    return Paciente.findOne({ id_paciente }).lean();
}

async function createPatient(id_paciente, nombre, especie, raza, fecha_nac, id_propietario, activo) {
    const patient = await getPatientById(id_paciente);
    if (patient) {
        throw new Error(`Patient with ID ${id_paciente} already exists.`);
    }

    const activoBoolean = activo.toLowerCase() === 'True'
    const payload = { id_paciente, nombre, especie, raza, fecha_nac, id_propietario, activo: activoBoolean };
    const created = await Paciente.create(payload);
    return created.toObject();
}

async function importPatientsFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
        const promises = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const promise = createPatient(
                    row.id_paciente, 
                    row.nombre, 
                    row.especie, 
                    row.raza, 
                    row.fecha_nac, 
                    row.id_propietario, 
                    row.activo
                ).catch(err => console.error(`Failed to import patient ${row.id_paciente}: ${err.message}`));
                promises.push(promise);
            })
            .on('end', async () => {
                await Promise.allSettled(promises);
                resolve();
            })
            .on('error', reject);
    });
}

module.exports = {
    getPatientById,
    createPatient,
    importPatientsFromCsv
};

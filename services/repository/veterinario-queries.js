const fs = require('fs')
const csv = require('csv-parser')
const mongoose = require('mongoose')

const Veterinario = require('../../models/mongo/Veterinario.js');

async function getVetById(id_vet) {
    return Veterinario.findOne({ id_vet }).lean();
}

async function createVet(id_vet, nombre, apellido, matricula, especialidad, sucursal, activo) {
    const vet = await getVetById(id_vet);
    if (vet) {
        throw new Error(`Vet with ID ${id_vet} already exists.`);
    }

    const activoBoolean = activo.toLowerCase() === 'True'
    const payload = { id_vet, nombre, apellido, matricula, especialidad, sucursal, activo: activoBoolean };
    const created = await Veterinario.create(payload);
    return created.toObject();
}

async function importVetsFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
        const promises = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const promise = createVet(
                    row.id_vet, 
                    row.nombre, 
                    row.apellido, 
                    row.matricula, 
                    row.especialidad, 
                    row.sucursal, 
                    row.activo
                ).catch(err => console.error(`Failed to import vet ${row.id_vet}: ${err.message}`));
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
    getVetById,
    createVet,
    importVetsFromCsv
};

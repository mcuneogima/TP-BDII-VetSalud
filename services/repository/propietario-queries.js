const fs = require('fs')
const csv = require('csv-parser')

const Propietario = require('../../models/mongo/Propietario.js');

async function getOwnerById(id_propietario) {
    return Propietario.findOne({ id_propietario }).lean();
}

async function createOwner(id_propietario, nombre, apellido, dni, email, telefono, ciudad, provincia) {
    const owner = await getOwnerById(id_propietario);
    if (owner) {
        throw new Error(`Owner with ID ${id_propietario} already exists.`);
    }

    const payload = { id_propietario, nombre, apellido, dni, email, telefono, ciudad, provincia };
    const created = await Propietario.create(payload);
    return created.toObject();
}

async function importOwnersFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
        const promises = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const promise = createOwner(
                    row.id_propietario, 
                    row.nombre, 
                    row.apellido, 
                    row.dni, 
                    row.email, 
                    row.telefono, 
                    row.ciudad, 
                    row.provincia
                ).catch(err => console.error(`Failed to import owner ${row.id_propietario}: ${err.message}`));
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
    getOwnerById,
    createOwner,
    importOwnersFromCsv
};

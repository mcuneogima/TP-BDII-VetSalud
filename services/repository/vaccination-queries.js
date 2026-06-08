const fs = require('fs')
const csv = require('csv-parser')

const {cassandraClient} = require('../connection/connection')

async function getVaccinationById(id_vacuna) {
    const queryCassandra = `
        SELECT *
        FROM vaccinations
        WHERE id_vacuna = ?`

    const result = await cassandraClient.execute(queryCassandra, [id_vacuna], {prepare: true})
    return result.first();
}

async function createVaccination(id_vacuna, id_paciente, id_vet, fecha_aplicacion, nombre_vacuna, proxima_dosis) {
    const vaccinationExists = await getVaccinationById(id_vacuna)

    if (vaccinationExists) {
        throw new Error(`Vaccination with ID ${id_vacuna} already exists.`);
    } else {
        const insertQuery = `
            INSERT INTO vaccinations (id_vacuna, id_paciente, id_vet, fecha_aplicacion, nombre_vacuna, proxima_dosis)
            VALUES (?, ?, ?, ?, ?, ?)`

        return await cassandraClient.execute(insertQuery, [id_vacuna, id_paciente, id_vet, fecha_aplicacion, nombre_vacuna, proxima_dosis], {prepare: true})
    }
}

async function importVaccinationsFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
        const promises = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const promise = createVaccination(
                    row.id_vacuna,
                    row.id_paciente,
                    row.id_vet,
                    new Date(row.fecha_aplicacion),
                    row.nombre_vacuna,
                    new Date(row.proxima_dosis)
                ).catch(err => console.error(`Failed to import vaccination ${row.id_vacuna}: ${err.message}`));
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
    getVaccinationById,
    createVaccination,
    importVaccinationsFromCsv
}

const mongoose = require('mongoose');

const {connectMongo, connectCassandra} = require('./services/connection/connection');
const {cassandraClient} = require('./services/connection/connection');

const {getPatientById, createPatient, importPatientsFromCsv} = require('./services/repository/patient-queries');
const {getVetById, createVet, importVetsFromCsv} = require('./services/repository/veterinario-queries')
const {getStockById, createStock, importStockFromCsv} = require('./services/repository/stock-queries')
const {getOwnerById, createOwner, importOwnersFromCsv} = require('./services/repository/propietario-queries')
const {getVaccinationById, createVaccination, importVaccinationsFromCsv} = require('./services/repository/vaccination-queries')
const { createTables } = require('./services/connection/cassandra-schema');

async function main() {
    try {
        await connectMongo();
        await connectCassandra();
        
        console.log('Successfully connected to Mongo and Cassandra!');

        await createTables();

        // await importVetsFromCsv("C:\\Users\\rluca\\IdeaProjects\\TP-BDII-VetSalud\\datasets_vetsalud\\veterinarios.csv")
        // await importStockFromCsv("C:\\Users\\rluca\\IdeaProjects\\TP-BDII-VetSalud\\datasets_vetsalud\\stock_farmaceutico.csv")
        // await importPatientsFromCsv("C:\\Users\\rluca\\IdeaProjects\\TP-BDII-VetSalud\\datasets_vetsalud\\pacientes.csv")
        // await importOwnersFromCsv("C:\\Users\\rluca\\IdeaProjects\\TP-BDII-VetSalud\\datasets_vetsalud\\propietarios.csv")
        await importVaccinationsFromCsv("C:\\Users\\rluca\\IdeaProjects\\TP-BDII-VetSalud\\datasets_vetsalud\\vacunaciones.csv")
    } finally {
        await Promise.allSettled([
            mongoose.disconnect(),
            cassandraClient.shutdown()
        ]);
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error('❌  Error al ejecutar el proyecto:', error.message || error);
        process.exitCode = 1;
    })
}

module.exports = {main}

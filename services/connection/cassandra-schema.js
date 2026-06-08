const {cassandraClient} = require('../connection/connection');

const KEYSPACE = 'vetsalud_ks';

async function createTables() {
    try {
        console.log('Iniciando la configuración del esquema en Cassandra...');

        const createKeyspaceQuery = `
            CREATE KEYSPACE IF NOT EXISTS ${KEYSPACE}
            WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'};
        `;

        await cassandraClient.execute(createKeyspaceQuery);
        console.log(`Keyspace "${KEYSPACE}" existe.`);
        await cassandraClient.execute(`USE ${KEYSPACE}`);

        const createVaccinationsTableQuery = `
            CREATE TABLE IF NOT EXISTS vaccinations
            (
                id_vacuna        text PRIMARY KEY,
                id_paciente      text,
                id_vet           text,
                fecha_aplicacion date,
                nombre_vacuna    text,
                proxima_dosis    date
            );`

        await cassandraClient.execute(createVaccinationsTableQuery);
        console.log('Vaccinations table exists now.');

        const createAppointmentsTableQuery = `
            CREATE TABLE IF NOT EXISTS appointments
            (
                id_consulta text PRIMARY KEY,
                id_paciente text,
                id_vet      text,
                fecha       date,
                motivo      text,
                diagnostico text,
                costo       int,
                estado      text
            );`

        await cassandraClient.execute(createAppointmentsTableQuery);
        console.log('Appointment table exists now.');
    } catch (error) {
        console.error('❌ Ocurrió un error al intentar crear las tablas en Cassandra:');
        console.error(error.message || error);
        throw error;
    }
}

module.exports = {createTables};

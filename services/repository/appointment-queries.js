const fs = require('fs')
const csv = require('csv-parser')

const {cassandraClient} = require('../connection/connection')

async function getAppointmentById(id_consulta) {
    const queryCassandra = `
    SELECT *
    FROM appointments
    WHERE id_consulta = ?`

    const result = await cassandraClient.execute(queryCassandra, [id_consulta], {prepare: true})
    return result.first();
}
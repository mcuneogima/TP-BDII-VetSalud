import path from 'node:path';

// MONGO
import {importPatientsFromCsv} from './services/repository/patient-queries.js';
import {importVetsFromCsv} from './services/repository/veterinario-queries.js'
import {importOwnersFromCsv} from './services/repository/propietario-queries.js'
import {importVaccinationsFromCsv} from './services/repository/vaccination-queries.js'
import {importStockFromCsv} from './services/repository/stock-queries.js'
import {importAppointmentsFromCsv} from './services/repository/appointment-queries.js'
// REDIS
import {closeAll, connectAll, redisClient} from './config/db.js';

import getIngresoMensualVeterinario from "./services/queries/q11_ingreso_mensual_veterinario.js";
import getOwnersWithNoAppointments from "./services/queries/q12_owners_without_appointments.js";
import {createOwner, modifyOwner, releaseOwner} from "./services/queries/q13_abm_propietario.js"
import {createAppointment} from "./services/queries/q14_nueva_consulta.js";
import {updateStock} from "./services/queries/q15_decremento_stock.js";

import {isExtended} from "./utils/csv";

async function main() {
    try {
        await connectAll();

        if (process.argv.includes('--import-csv')) {
            const dataDir = path.join(process.cwd(), 'data');

            await redisClient.flushDb()

            await importVetsFromCsv(path.join(dataDir, 'veterinarios', isExtended() ? '.csv' : '_ext.csv'))
            await importPatientsFromCsv(path.join(dataDir, 'pacientes', isExtended() ? '.csv' : '_ext.csv'))
            await importOwnersFromCsv(path.join(dataDir, 'propietarios', isExtended() ? '.csv' : '_ext.csv'))

            await importStockFromCsv(path.join(dataDir, 'stock_farmaceutico', isExtended() ? '.csv' : '_ext.csv'))
            await importVaccinationsFromCsv(path.join(dataDir, 'vacunaciones', isExtended() ? '.csv' : '_ext.csv'))
            await importAppointmentsFromCsv(path.join(dataDir, 'consultas', isExtended() ? '.csv' : '_ext.csv'))
        }

        if (process.argv.includes('--monthly-income')) {
            const ingresoMensualPorVeterinario = await getIngresoMensualVeterinario()
            console.log(ingresoMensualPorVeterinario)
        }

        if (process.argv.includes('--no-appointment-owners')) {
            const ownersWithNoAppointments = await getOwnersWithNoAppointments()
            console.log(ownersWithNoAppointments)
        }

        if (process.argv.includes('--owner-abm')) {
            const createdOwner = await createOwner("Juan", "Gutierrez", 45433045, "juangutierrez@gmail.com", 1166624363, "Buenos Aires", "Buenos Aires")
            console.log(createdOwner)

            const modifiedOwner = await modifyOwner("C008", {activo: true, nombre: "eljuan"})
            console.log(modifiedOwner)

            const releasedOwner = await releaseOwner("C014")
            console.log(releasedOwner)
        }

        if (process.argv.includes('--new-appointment')) {
            const newAppointment = await createAppointment("P001", "V001", new Date('2024-08-10'), "porque si", "se nos muere", 100, "muerto")
            console.log(newAppointment)
        }

        if (process.argv.includes('--decrease-stock')) {
            const idProducto = process.argv[process.argv.indexOf('--decrement-stock') + 1]
            const cantidad = Number(process.argv[process.argv.indexOf('--decrement-stock') + 2])

            if (!idProducto || !idProducto) {
                console.error('Uso: node q15_decremento_stock.js <id_producto> <cantidad>')
                console.error('Ejemplo: node q15_decremento_stock.js PRD001 5')
                process.exit(1)
            } else if (!/^[A-Z0-9]{1,10}$/.test(idProducto)) {
                console.error('ID de producto inválido. Formato esperado: PRD001')
                process.exit(1)
            } else if (!Number.isInteger(cantidad) || cantidad <= 0) {
                console.error('La cantidad debe ser un número entero positivo.')
                process.exit(1)
            } else {
                const updatedStock = await updateStock(idProducto, cantidad)
                console.log(updatedStock)
            }
        }
    } finally {
        await closeAll();
    }
}

main().catch((error) => {
    console.error('❌  Error al ejecutar el proyecto:', error.message || error);
    process.exitCode = 1;
})
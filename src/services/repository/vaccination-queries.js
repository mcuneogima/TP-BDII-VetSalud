import {readCsv} from '../../utils/csv.js';
import {redisClient} from "../../config/db.js";

export async function getVaccinationById(id_vacuna) {
    const vaccination = await redisClient.hGetAll(`vacuna:${id_vacuna}`);

    if (Object.keys(vaccination).length === 0) {
        return null;
    }

    return vaccination;
}

export async function createNewVaccination(id_vacuna, id_paciente, id_vet, fecha_aplicacion, nombre_vacuna, proxima_dosis) {
    const vaccination = await getVaccinationById(id_vacuna);

    if (vaccination !== null) {
        throw new Error(`Vaccination with ID ${id_vacuna} already exists.`);
    }

    const index = await redisClient.hSet(`vacuna:${id_vacuna}`, {
        id_paciente: id_paciente,
        id_vet: id_vet,
        fecha_aplicacion: fecha_aplicacion,
        nombre_vacuna: nombre_vacuna,
        proxima_dosis: proxima_dosis
    });

    const score =
        new Date(proxima_dosis).getTime() / 1000

    await redisClient.zAdd('vacunas:vencimiento', [{
        score: score,
        value: JSON.stringify({
            id_vacuna: id_vacuna,
            id_paciente: id_paciente,
            id_vet: id_vet,
            fecha_aplicacion: new Date(fecha_aplicacion),
            nombre_vacuna: nombre_vacuna,
            proxima_dosis: new Date(proxima_dosis)
        })
    }]);

    return index;
}

export async function importVaccinationsFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewVaccination(
            row.id_vacuna,
            row.id_paciente,
            row.id_vet,
            row.fecha_aplicacion,
            row.nombre_vacuna,
            row.proxima_dosis
        ).catch(err => console.error(`Failed to import vaccination ${row.id_vacuna}: ${err.message}`))
    );

    await Promise.allSettled(promises);
}

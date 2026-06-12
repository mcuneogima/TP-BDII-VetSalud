import Propietario from '../../models/Propietario.js';
import {readCsv} from '../../utils/csv.js';

export async function getOwnerById(id_propietario) {
    return Propietario.findOne({id_propietario}).lean();
}

export async function createNewOwner(id_propietario, nombre, apellido, dni, email, telefono, ciudad, provincia) {
    const owner = await getOwnerById(id_propietario);
    if (owner) {
        throw new Error(`Owner with ID ${id_propietario} already exists.`);
    }

    const payload = {id_propietario, nombre, apellido, dni, email, telefono, ciudad, provincia, activo: true};
    const created = await Propietario.create(payload);
    return created.toObject();
}

export async function importOwnersFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewOwner(
            row.id_propietario,
            row.nombre,
            row.apellido,
            parseInt(row.dni),
            row.email,
            parseInt(row.telefono),
            row.ciudad,
            row.provincia
        ).catch(err => console.error(`Failed to import owner ${row.id_propietario}: ${err.message}`))
    );

    await Promise.allSettled(promises);
}
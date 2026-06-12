import Veterinario from '../../models/Veterinario.js';
import {readCsv} from '../../utils/csv.js';

export async function getVetById(id_vet) {
    return Veterinario.findOne({id_vet}).lean();
}

export async function createNewVet(id_vet, nombre, apellido, matricula, especialidad, sucursal, activo) {
    const vet = await getVetById(id_vet);
    if (vet) {
        throw new Error(`Vet with ID ${id_vet} already exists.`);
    }

    const activoBoolean = activo.toLowerCase() === 'True'
    const payload = {id_vet, nombre, apellido, matricula, especialidad, sucursal, activo: activoBoolean};
    const created = await Veterinario.create(payload);
    return created.toObject();
}

export async function importVetsFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewVet(
            row.id_vet,
            row.nombre,
            row.apellido,
            row.matricula,
            row.especialidad,
            row.sucursal,
            row.activo
        ).catch(err => console.error(`Failed to import vet ${row.id_vet}: ${err.message}`))
    );

    await Promise.allSettled(promises);
}

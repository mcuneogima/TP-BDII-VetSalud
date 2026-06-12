import Owner from '../../models/Propietario.js'
import {createNewOwner} from '../repository/propietario-queries.js'
import Propietario from "../../models/Propietario.js";

export async function createOwner(nombre, apellido, dni, email, telefono, ciudad, provincia) {
    const id_propietario = await getNextOwnerIdNumber()
    const newOwner = await createNewOwner(id_propietario, nombre, apellido, dni, email, telefono, ciudad, provincia)
    return newOwner
}

export async function modifyOwner(id_propietario, modifiedFields) {
    const update = await Owner.updateOne({id_propietario: id_propietario}, {$set: {...modifiedFields}}).lean()
    return update.modifiedCount
}

export async function releaseOwner(id_propietario) {
    const releasedOwner = await modifyOwner(id_propietario, {activo: false})
    return releasedOwner == 1 ? true : false
}

async function getNextOwnerIdNumber() {
    const lastOwnerId = await Propietario
        .find({})
        .sort({id_propietario: -1})
        .limit(1)
        .select('id_propietario')
        .lean()

    if (lastOwnerId.length > 0) {
        const numericPartString = lastOwnerId[0].id_propietario.replace(/[^0-9]/g, '');
        const lastId = parseInt(numericPartString, 10);
        return 'C' + String(lastId + 1).padStart(3, '0');
    }
    return 'C001'
}
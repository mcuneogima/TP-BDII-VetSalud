import {readCsv} from '../../utils/csv.js';
import {redisClient} from '../../config/db.js'

export async function getStockById(id_producto) {
    const stock = await redisClient.hGetAll(`stock:${id_producto}`)

    if (Object.keys(stock).length === 0) {
        return null
    }

    return stock
}

export async function createNewStock(id_producto, nombre, categoria, unidades, precio_unit, vencimiento, proveedor) {
    const stock = await getStockById(id_producto);
    if (stock !== null) {
        throw new Error(`Stock with ID ${id_producto} already exists.`);
    }

    const created = await redisClient.hSet(`stock:${id_producto}`, {
        nombre: nombre,
        categoria: categoria,
        unidades: unidades,
        precio_unit: precio_unit,
        vencimiento: vencimiento,
        proveedor: proveedor
    })
    return created
}

export async function importStockFromCsv(csvPath) {
    const rows = readCsv(csvPath);
    const promises = rows.map(row =>
        createNewStock(
            row.id_producto,
            row.nombre,
            row.categoria,
            parseInt(row.unidades),
            parseInt(row.precio_unit),
            row.vencimiento,
            row.proveedor
        ).catch(err => console.error(`Failed to import stock ${row.id_producto}: ${err.message}`))
    );

    await Promise.allSettled(promises);
}

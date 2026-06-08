const fs = require('fs')
const csv = require('csv-parser')

const StockFarmaceutico = require('../../models/mongo/StockFarmaceutico.js');

async function getStockById(id_producto) {
    return StockFarmaceutico.findOne({ id_producto }).lean();
}

async function createStock(id_producto, nombre, categoria, unidades, precio_unit, vencimiento, proveedor) {
    const stock = await getStockById(id_producto);
    if (stock) {
        throw new Error(`Product with ID ${id_producto} already exists.`);
    }

    const payload = { id_producto, nombre, categoria, unidades, precio_unit, vencimiento, proveedor };
    const created = await StockFarmaceutico.create(payload);
    return created.toObject();
}

async function importStockFromCsv(csvPath) {
    return new Promise((resolve, reject) => {
        const promises = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const promise = createStock(
                    row.id_producto, 
                    row.nombre, 
                    row.categoria, 
                    row.unidades, 
                    row.precio_unit, 
                    row.vencimiento, 
                    row.proveedor
                ).catch(err => console.error(`Failed to import stock ${row.id_producto}: ${err.message}`));
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
    getStockById,
    createStock,
    importStockFromCsv
};

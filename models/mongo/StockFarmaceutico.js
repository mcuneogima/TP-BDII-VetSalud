const mongoose = require('mongoose');

const stockFarmaceuticoSchema = new mongoose.Schema({
    id_producto: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    unidades: {
        type: Number,
        required: true
    },
    precio_unit: {
        type: Number,
        required: true
    },
    vencimiento: {
        type: Date,
        required: true
    },
    proveedor: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('StockFarmaceutico', stockFarmaceuticoSchema);
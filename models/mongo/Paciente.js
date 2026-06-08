const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    id_paciente: {
        type: String,
        required: true,
        unique: true,
    },
    nombre: {
        type: String,
        required: true
    },
    especie: {
        type: String,
        required: true
    },
    raza: {
        type: String,
        required: true
    },
    fecha_nac: {
        type: Date,
        required: true
    },
    id_propietario: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Paciente', pacienteSchema);


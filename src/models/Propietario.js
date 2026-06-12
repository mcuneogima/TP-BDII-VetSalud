import mongoose from 'mongoose';

const propietarioSchema = new mongoose.Schema({
    id_propietario: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    ciudad: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        required: true,
        default: true,
        index: true
    }
})

export default mongoose.model('Propietario', propietarioSchema);
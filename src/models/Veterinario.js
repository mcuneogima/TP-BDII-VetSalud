import mongoose from 'mongoose';

const veterinarioSchema = new mongoose.Schema({
    id_vet: {
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
    matricula: {
        type: String,
        required: true,
        unique: true
    },
    especialidad: {
        type: String,
        required: true
    },
    sucursal: {
        type: String,
        required: true,
        index: true
    },
    activo: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('Veterinario', veterinarioSchema);
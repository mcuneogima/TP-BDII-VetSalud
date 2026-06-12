import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'
export async function insertPropietario(_id, nombre, apellido, dni, email, telefono, ciudad, provincia) {
    const db = getDB()
    const result = await db.collection('propietarios').insertOne(
        { _id, nombre, apellido, dni, email, telefono, ciudad, provincia, activo: true }
    )
    return result.acknowledged ? { _id, nombre, apellido, dni, email, telefono, ciudad, provincia } : null
}

const args = process.argv.slice(2)
const _id = args[0]?.trim()
const nombre = args[1]?.trim()
const apellido = args[2]?.trim()
const dni = args[3]?.trim()
const email = args[4]?.trim()
const telefono = args[5]?.trim()
const ciudad = args[6]?.trim()
const provincia = args[7]?.trim()

if (!_id || !nombre || !apellido || !dni || !email || !telefono || !ciudad || !provincia) {
  console.error('Uso: node q13_upsert_propietario.js <_id> <nombre> <apellido> <dni> <email> <telefono> <ciudad> <provincia>')
  console.error('Ejemplo: node q13_upsert_propietario.js C001 Juan Pérez 12345678 juan.perez@email.com 123456789 Chivilcoy Buenos Aires')
  process.exit(1)
}

// Sanitización: solo letras, espacios y guiones, máximo 50 chars
if (!/^[0-9]{1,16}$/.test(dni) ||
    !/^[0-9]{1,16}$/.test(telefono) ||
    !/^C[0-9]{3}$/.test(_id) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(ciudad) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(provincia) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(nombre) ||
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]{1,50}$/.test(apellido) ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
  console.error('Datos del propietario inválidos.')
  process.exit(1)
}

withMongo(async () => { console.log(await insertPropietario(_id, nombre, apellido, dni, email, telefono, ciudad, provincia)) })
import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'
export async function deletePropietario(_id) {
    const db = getDB()
    const existing = await db.collection('propietarios').findOne({ _id })
    if (!existing) {
        console.error('Propietario no encontrado con id:', _id)
        return null
    }
    const result = await db.collection('propietarios').updateOne(
        {_id: _id},
        { $set: { activo: false } },
        { upsert: 0 }
    )
    return result.acknowledged ? { _id } : null
}

const args = process.argv.slice(2)
const _id = args[0]?.trim()

if (!_id) {
  console.error('Uso: node q13_delete_propietario.js <_id>')
  console.error('Ejemplo: node q13_delete_propietario.js C001')
  process.exit(1)
}

// Sanitización: solo letras, espacios y guiones, máximo 50 chars
if (!/^C[0-9]{3}$/.test(_id)) {
  console.error('_id del propietario inválido.')
  process.exit(1)
}

withMongo(async () => { console.log(await deletePropietario(_id)) })
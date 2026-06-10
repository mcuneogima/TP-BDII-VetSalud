// queries/q15_actualizar_stock.js
import { getDB } from '../config/db.js'
import { redisClient } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'
import { withRedis } from '../utils/withRedis.js'

export async function actualizarStock(idProducto, cantidad) {

  const db = getDB()

  await Promise.all([

    // Mongo: decrementa unidades
    db.collection('stock').updateOne(
      { _id: idProducto },
      { $inc: { unidades: -cantidad } }
    ),

    // Redis: decrementa atómico
    redisClient.hIncrBy(
      `stock:${idProducto}`,
      'unidades',
      -cantidad
    )

  ])
}

// =====================
// CLI
// =====================

const args = process.argv.slice(2)
const idProducto = args[0]?.trim()
const cantidad = Number(args[1])

if (!idProducto || !args[1]) {
  console.error('Uso: node q15_actualizar_stock.js <id_producto> <cantidad>')
  console.error('Ejemplo: node q15_actualizar_stock.js PRD001 5')
  process.exit(1)
}

// Sanitización id: formato PRD001
if (!/^[A-Z0-9]{1,10}$/.test(idProducto)) {
  console.error('ID de producto inválido. Formato esperado: PRD001')
  process.exit(1)
}

// Sanitización cantidad: entero positivo
if (!Number.isInteger(cantidad) || cantidad <= 0) {
  console.error('La cantidad debe ser un número entero positivo.')
  process.exit(1)
}

await withRedis(async () => {
  await withMongo(async () => {

    const db = getDB()

    // Verificar que el producto existe antes de decrementar
    const producto = await db.collection('stock')
      .findOne({ _id: idProducto })

    if (!producto) {
      console.error(`No se encontró el producto: ${idProducto}`)
      process.exit(1)
    }

    if (producto.unidades < cantidad) {
      console.error(`Stock insuficiente. Disponible: ${producto.unidades}, solicitado: ${cantidad}`)
      process.exit(1)
    }

    await actualizarStock(idProducto, cantidad)

    console.log(
      `Stock actualizado. Producto: ${idProducto} | ` +
      `Unidades descontadas: ${cantidad} | ` +
      `Stock restante: ${producto.unidades - cantidad}`
    )

  })
})
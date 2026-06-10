import { connectRedis, closeRedis, redisClient } from '../config/db.js'
import { readCsv } from './csv.js'
import { csvPath, isExtended } from './dataset.js'

await connectRedis()

try {

  const vacunaciones = readCsv(csvPath('vacunaciones'))

  const stock = readCsv(csvPath('stock_farmaceutico'))

  const consultas = readCsv(csvPath('consultas'))

  await redisClient.flushDb()

  // =====================
  // VACUNAS POR VENCIMIENTO
  // =====================

  for (const vacuna of vacunaciones) {

    const score =
      new Date(vacuna.proxima_dosis).getTime()

    await redisClient.zAdd(
      'vacunas:vencimiento',
      [{
        score,
        value: JSON.stringify({
          id_vacuna: vacuna.id_vacuna,
          id_paciente: vacuna.id_paciente,
          id_vet: vacuna.id_vet,
          proxima_dosis: vacuna.proxima_dosis
        })
      }]
    )
  }

  // =====================
  // STOCK OPERACIONAL
  // =====================

  for (const producto of stock) {

    await redisClient.hSet(
      `stock:${producto.id_producto}`,
      {
        nombre: producto.nombre,
        categoria: producto.categoria,
        unidades: producto.unidades,
        proveedor: producto.proveedor
      }
    )
  }

  // =====================
  // CONTADORES
  // =====================

  for (const consulta of consultas) {

    const fecha = new Date(consulta.fecha)

    const periodo =
      `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, '0')}`

    await redisClient.incrBy(
      `stats:ingresos:${periodo}:${consulta.id_vet}`,
      Number(consulta.costo)
    )
  }

  console.log('Redis poblado correctamente')

} catch (err) {

  console.error(err)

} finally {

  await closeRedis()

}
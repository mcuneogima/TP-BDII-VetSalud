import { connectRedis, closeRedis, redisClient } from '../config/db.js'
import { readCsv } from './csv.js'

await connectRedis()

try {

  const vacunaciones = readCsv('./data/vacunaciones.csv')

  const stock = readCsv('./data/stock_farmaceutico.csv')

  const consultas = readCsv('./data/consultas.csv')

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

    await redisClient.incr(
      `stats:consultas:${consulta.id_vet}`
    )

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
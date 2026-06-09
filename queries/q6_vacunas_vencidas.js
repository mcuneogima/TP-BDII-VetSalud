import { redisClient } from '../config/db.js'
import { withRedis } from '../utils/withRedis.js'

export async function getVacunasVencidas() {

  const ahora = Date.now()

  // ZRANGEBYSCORE desde -inf hasta ahora → todos los vencidos
  const resultados = await redisClient.zRangeByScore(
    'vacunas:vencimiento',
    '-inf',
    ahora
  )

  return resultados.map(r => JSON.parse(r))
}

withRedis(async () => { console.log(await getVacunasVencidas()) })
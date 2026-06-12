import { getDB } from '../config/db.js'
import { redisClient } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'
import { withRedis } from '../utils/withRedis.js'

export async function getVistaIngresos() {
    const db = getDB()
    await db.dropCollection('vista_ingresos').catch(() => {})
    const thisMonth = new Date().toISOString().slice(0, 7)
    const income = await redisClient.hGetAll(`stats:ingresos:${thisMonth}`)
    const incomeJS = Object.entries(income).map(([id_vet, total]) => ({ id_vet, total_ingresos: Number(total) }))
    if (incomeJS.length === 0) return []
    await db.collection('vista_ingresos').insertMany(incomeJS)
    return db.collection('vista_ingresos').find().toArray()
}
withRedis(async () => {
    await withMongo(async () => {
        console.log(await getVistaIngresos())
    })
})
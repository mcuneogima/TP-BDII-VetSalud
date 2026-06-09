import { getDB } from '../config/db.js'
import { withMongo } from '../utils/withMongo.js'

export async function getStockBajo() {

  const db = getDB()

  return db.collection('stock')
    .find(
      { unidades: { $lt: 50 } },
      {
        projection: {
          nombre: 1,
          categoria: 1,
          unidades: 1,
          proveedor: 1
        }
      }
    )
    .toArray()
}

withMongo(async () => { console.log(await getStockBajo()) })
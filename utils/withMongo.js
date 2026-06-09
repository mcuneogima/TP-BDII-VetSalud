import { connectMongo, closeMongo } from '../config/db.js'

export async function withMongo(fn) {
  await connectMongo()
  try {
    return await fn()
  } finally {
    await closeMongo()
  }
}
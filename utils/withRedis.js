import { connectRedis, closeRedis } from '../config/db.js'

export async function withRedis(fn) {
  await connectRedis()
  try {
    return await fn()
  } finally {
    await closeRedis()
  }
}
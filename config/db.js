import { MongoClient } from 'mongodb'
import { createClient } from 'redis'
import 'dotenv/config'

export const mongoClient = new MongoClient(process.env.MONGO_URI)
export const redisClient = createClient({ url: process.env.REDIS_URL })

redisClient.on('error', (err) => console.error('Redis error:', err))

export async function connectAll() {
  await mongoClient.connect()
  await redisClient.connect()
  console.log('Conectado a MongoDB y Redis')
}

export async function connectMongo() {
  await mongoClient.connect()
  console.log('Conectado a MongoDB')
}

export async function connectRedis() {
  await redisClient.connect()
  console.log('Conectado a Redis')
}

export async function closeAll() {
  await mongoClient.close()
  await redisClient.quit()
}

export async function closeMongo() {
  await mongoClient.close()
}

export async function closeRedis() {
  await redisClient.quit()
}

export function getDB() {
  return mongoClient.db(process.env.MONGO_DB)
}
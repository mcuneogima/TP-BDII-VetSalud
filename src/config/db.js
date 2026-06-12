import mongoose from 'mongoose'
import {createClient} from 'redis'
import 'dotenv/config'

export const redisClient = createClient({url: process.env.REDIS_URL})

redisClient.on('error', (err) => console.error('Redis error:', err))

export async function connectAll() {
    try {
        await connectMongo()
        await connectRedis()
    } catch (error) {
        console.error('Error crítico al inicializar las bases de datos:', error)
        throw error
    }
}

export async function connectMongo() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB')
    } catch (error) {
        console.error('Fallo al conectar con MongoDB:', error)
        throw error
    }
}

export async function connectRedis() {
    try {
        await redisClient.connect()
        console.log('Conectado a Redis')
    } catch (error) {
        console.error('Fallo al conectar con Redis:', error)
        throw error
    }
}

export async function closeAll() {
    try {
        await closeMongo()
        await closeRedis()
    } catch (error) {
        console.error('Error al cerrar las conexiones:', error)
        throw error
    }
}

export async function closeMongo() {
    try {
        await mongoose.disconnect()
        console.log('Desconectado de MongoDB')
    } catch (error) {
        console.error('Error al desconectar MongoDB:', error)
        throw error
    }
}

export async function closeRedis() {
    try {
        await redisClient.quit()
        console.log('Desconectado de Redis')
    } catch (error) {
        console.error('Error al desconectar Redis:', error)
        throw error
    }
}

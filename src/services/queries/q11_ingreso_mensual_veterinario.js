import {redisClient} from '../../config/db.js'

export default async function getIngresoMensualVeterinario() {
    try {
        const dateNow = new Date("2025-11-10");
        const periodo = `${dateNow.getFullYear()}-${String(dateNow.getMonth() + 1).padStart(2, '0')}`;
        const pattern = `stats:ingresos:${periodo}:*`;

        const matchingKeys = [];
        const matchedPatterns = await redisClient.scanIterator({MATCH: pattern})

        for await (const key of matchedPatterns) {
            matchingKeys.push(key);
        }

        if (matchingKeys.length === 0) return [];

        const dataPromises = matchingKeys.map(async (key) => {
            const data = await redisClient.get(key);

            const id_vet = key.split(':').pop();

            return {
                id_vet: id_vet,
                ingreso: data
            };
        });

        return await Promise.all(dataPromises);
    } catch (error) {
        console.error(error);
    }
}

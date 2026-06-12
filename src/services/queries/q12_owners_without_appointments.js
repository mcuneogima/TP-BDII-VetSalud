import {redisClient} from '../../config/db.js'
import Paciente from '../../models/Paciente.js'

export default async function getOwnersWithNoAppointments() {
    try {
        const yearNow = new Date().getUTCFullYear()
        const patientsThisYear = await redisClient.sMembers(`appointment:${yearNow.toString()}`)

        const ownersForPatients = await Paciente.distinct(
            'id_propietario',
            {id_paciente: {$nin: patientsThisYear}}
        )

        return ownersForPatients
    } catch (e) {
        console.error(e)
    }
}
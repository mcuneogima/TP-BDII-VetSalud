import { connectMongo, closeMongo, getDB } from '../config/db.js'
import { readCsv } from './csv.js'
import { csvPath, isExtended } from './dataset.js'

await connectMongo()

const db = getDB()

try {

  const propietarios = readCsv(csvPath('propietarios'))
  const pacientes = readCsv(csvPath('pacientes'))
  const veterinarios = readCsv(csvPath('veterinarios'))
  const consultas = readCsv(csvPath('consultas'))
  const vacunaciones = readCsv(csvPath('vacunaciones'))
  const stock = readCsv(csvPath('stock_farmaceutico'))

  await Promise.all([
    db.collection('propietarios').deleteMany({}),
    db.collection('pacientes').deleteMany({}),
    db.collection('veterinarios').deleteMany({}),
    db.collection('consultas').deleteMany({}),
    db.collection('stock').deleteMany({}),
    db.collection('turnos').deleteMany({})
  ])

  const vacunasPorPaciente = {}

  for (const vacuna of vacunaciones) {

    if (!vacunasPorPaciente[vacuna.id_paciente]) {
      vacunasPorPaciente[vacuna.id_paciente] = []
    }

    vacunasPorPaciente[vacuna.id_paciente].push({
      id_vacuna: vacuna.id_vacuna,
      id_vet: vacuna.id_vet,
      fecha_aplicacion: new Date(vacuna.fecha_aplicacion),
      nombre_vacuna: vacuna.nombre_vacuna,
      proxima_dosis: new Date(vacuna.proxima_dosis)
    })
  }

  const pacientesMongo = pacientes.map(paciente => ({
    _id: paciente.id_paciente,
    nombre: paciente.nombre,
    especie: paciente.especie,
    raza: paciente.raza,
    fecha_nac: new Date(paciente.fecha_nac),
    id_propietario: paciente.id_propietario,
    activo: paciente.activo === 'True',

    vacunaciones:
      vacunasPorPaciente[paciente.id_paciente] || []
  }))

  const propietariosMongo = propietarios.map(prop => ({
    _id: prop.id_propietario,
    nombre: prop.nombre,
    apellido: prop.apellido,
    dni: prop.dni,
    email: prop.email,
    telefono: prop.telefono,
    ciudad: prop.ciudad,
    provincia: prop.provincia
    // activo: true // redundante
  }))

  const veterinariosMongo = veterinarios.map(vet => ({
    _id: vet.id_vet,
    nombre: vet.nombre,
    apellido: vet.apellido,
    matricula: vet.matricula,
    especialidad: vet.especialidad,
    sucursal: vet.sucursal,
    activo: vet.activo === 'True'
  }))

  const turnosMongo = consultas.map(c => ({
    _id: c.id_consulta,
    id_paciente: c.id_paciente,
    id_vet: c.id_vet,
    fecha: new Date(c.fecha),
    tipo: "Consulta"
  }))
  turnosMongo.push(...vacunaciones.map(v => ({
    _id: v.id_vacuna,
    id_paciente: v.id_paciente,
    id_vet: v.id_vet,
    fecha: new Date(v.fecha_aplicacion),
    tipo: "Vacunación"
  })))

  const consultasMongo = consultas.map(c => ({
    _id: c.id_consulta,
    id_paciente: c.id_paciente,
    id_vet: c.id_vet,
    fecha: new Date(c.fecha),
    motivo: c.motivo,
    diagnostico: c.diagnostico,
    costo: Number(c.costo),
    estado: c.estado
  }))

  const stockMongo = stock.map(p => ({
    _id: p.id_producto,
    nombre: p.nombre,
    categoria: p.categoria,
    unidades: Number(p.unidades),
    precio_unit: Number(p.precio_unit),
    vencimiento: new Date(p.vencimiento),
    proveedor: p.proveedor
  }))

  await db.collection('propietarios').insertMany(propietariosMongo)
  await db.collection('pacientes').insertMany(pacientesMongo)
  await db.collection('veterinarios').insertMany(veterinariosMongo)
  await db.collection('turnos').insertMany(turnosMongo)
  await db.collection('consultas').insertMany(consultasMongo)
  await db.collection('stock').insertMany(stockMongo)

  await db.collection('pacientes').createIndex({ id_propietario: 1 })

  await db.collection('consultas').createIndex({ id_paciente: 1 })

  await db.collection('consultas').createIndex({ id_vet: 1 })

  await db.collection('consultas').createIndex({ fecha: -1 })

  await db.collection('veterinarios').createIndex({ sucursal: 1 })

  await db.collection('consultas').createIndex({ estado: 1 }) 

  await db.collection('consultas').createIndex({ id_paciente: 1, fecha: -1 }) 

  await db.collection('consultas').createIndex({ id_vet: 1, fecha: -1 })  

  await db.collection('propietarios').createIndex({ activo: 1 })

  await db.collection('turnos').createIndex({ fecha: 1 })

  console.log('MongoDB poblado correctamente')

} catch (err) {

  console.error(err)

} finally {

  await closeMongo()

}
const ElectricChargingSession = require('../models/electricChargingSessionModel')

// get all electric charging sessions
const getAllElectricChargingSessions = async (req, res) => {
    const electricChargingSessions = await ElectricChargingSession.findAll();

    res.status(200).json(electricChargingSessions)
}

// get a specific electric charging session by id
const getElectricChargingSessionById = async (req, res) => {
    const { id } = req.params

    const electricChargingSession = await ElectricChargingSession.findOne({ where: { id } })

    res.status(200).json(electricChargingSession)
}

// get all charging sessions belonging to a parking session id
const getAllElectricChargingSessionsByParkingSessionId = async (req, res) => {
    const { parkingSessionId } = req.params

    const electricChargingSession = await ElectricChargingSession.findAll({ where: { parkingsession_id: parkingSessionId } })

    res.status(200).json(electricChargingSession)
}

// create a new electric charging session
const createElectricChargingSession = async (req, res) => {
    const { parkingsession_id, chargingpoint_id } = req.body

    const newElectricChargingSession = await ElectricChargingSession.create({ parkingsession_id, chargingpoint_id })

    res.status(200).json(newElectricChargingSession)
}

// end a specific electric charging session
const endElectricChargingSession = async (req, res) => {
    const { id } = req.params

    // check if there is a future datetime for testing purposes to use as end time
    const futureDateTime = req.body.futureDateTime ? new Date(req.body.futureDateTime) : null
    const now = new Date()
    const endDateTime = futureDateTime > now ? futureDateTime : now

    console.log("id", id)
    console.log("endDateTime", endDateTime)
    const updatedElectricChargingSession = await ElectricChargingSession.update({ session_ended: endDateTime }, {
        where: { id }
    })
    console.log("updated db entry", updatedElectricChargingSession)

    res.status(200).json(updatedElectricChargingSession)
}

module.exports = {
    getAllElectricChargingSessions,
    getElectricChargingSessionById,
    getAllElectricChargingSessionsByParkingSessionId,
    createElectricChargingSession,
    endElectricChargingSession
}
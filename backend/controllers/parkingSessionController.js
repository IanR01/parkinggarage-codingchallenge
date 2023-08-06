const ParkingSession = require('../models/parkingSessionModel')


// get all parking-sessions
const getParkingSessions = async (req, res) => {
    const parkingSessions = await ParkingSession.findAll();

    res.status(200).json(parkingSessions)
}

// get a specific parking session by id
const getParkingSession = async (req, res) => {
    const { id } = req.params

    const parkingSession = await ParkingSession.findOne({
        where: {
            id
        }
    })

    res.status(200).json(parkingSession)
}

// create a new parking session
const createParkingSession = async (req, res) => {
    const { parkingspots_group_id } = req.body

    const newParkingSession = await ParkingSession.create({
        parkingspots_group_id
    })

    res.status(200).json(newParkingSession)
}

// update a specific parking session
const endParkingSession = async (req, res) => {
    const { id } = req.params
    const { session_ended } = req.body

    const updatedParkingSession = await ParkingSession.update({ session_ended }, {
        where: {
            id
        }
    })

    res.status(200).json(updatedParkingSession)
}

module.exports = {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    endParkingSession
}
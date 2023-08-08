const express = require('express')

const {
    getAllElectricChargingSessions,
    getElectricChargingSessionById,
    getAllElectricChargingSessionsByParkingSessionId,
    createElectricChargingSession,
    endElectricChargingSession
} = require('../controllers/electricChargingSessionController')

const router = express.Router()

// get all electric charging sessions
router.get('/', getAllElectricChargingSessions)

// get a specific electric charging session by charging session id
router.get('/:id', getElectricChargingSessionById)

// get all charging sessions belonging to a parking session id
router.get('/all-from-parking-session/:parkingSessionId', getAllElectricChargingSessionsByParkingSessionId)

// create a new electric charging session
router.post('/', createElectricChargingSession)

// end a specific electric charging session
router.post('/:id', endElectricChargingSession)

module.exports = router
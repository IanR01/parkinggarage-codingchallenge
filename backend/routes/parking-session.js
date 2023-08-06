const express = require('express')

const {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    endParkingSession
} = require('../controllers/parkingSessionController')

const router = express.Router()

// get all parking sessions
router.get('/', getParkingSessions)

// get a specific parking session by id
router.get('/:id', getParkingSession)

// create a new parking session
router.post('/', createParkingSession)

// end a specific parking session
router.post('/:id', endParkingSession)

module.exports = router
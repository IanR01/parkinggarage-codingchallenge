const express = require('express')

const {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    updateParkingSession
} = require('../controllers/parkingSessionController')

const router = express.Router()

// get all parking sessions
router.get('/', getParkingSessions)

// get a specific parking session by id
router.get('/:id', getParkingSession)

// create a new parking session
router.post('/', createParkingSession)

// update a specific parking session
router.post('/:id', updateParkingSession)

module.exports = router
const express = require('express')

const {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    processPaymentOnParkingSession,
    endParkingSession
} = require('../controllers/parkingSessionController')

const router = express.Router()

// get all parking sessions
router.get('/', getParkingSessions)

// get a specific parking session by id
router.get('/:id', getParkingSession)

// create a new parking session
router.post('/', createParkingSession)

// process payment on a specific parking session
router.post('/payment/:id', processPaymentOnParkingSession)

// end a specific parking session
router.post('/:id', endParkingSession)

module.exports = router
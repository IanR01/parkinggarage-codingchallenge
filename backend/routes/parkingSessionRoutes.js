const express = require('express')

const {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    getParkingSessionCosts,
    processParkingSessionPayment,
    endParkingSession,
    getAvailableParkingSpots
} = require('../controllers/parkingSessionController')

const router = express.Router()

// get all parking sessions
router.get('/', getParkingSessions)

// get a specific parking session by id
router.get('/:id', getParkingSession)

// create a new parking session
router.post('/', createParkingSession)

// process payment on a specific parking session
router.post('/payment/:id', processParkingSessionPayment)

// get parking session costs
router.get('/payment/:id', getParkingSessionCosts)

// end a specific parking session
router.post('/:id', endParkingSession)

// get available parking spots
router.get('/available/:id', getAvailableParkingSpots)

module.exports = router
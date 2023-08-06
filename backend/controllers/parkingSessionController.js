const ParkingSession = require('../models/parkingSessionModel')


// get all parking-sessions
const getParkingSessions = async (req, res) => {
    const parkingSessions = await ParkingSession.findAll();

    res.status(200).json(parkingSessions)
}

// get a specific parking session by id
const getParkingSession = async (req, res) => {
    const { id } = req.params

    const parkingSession = await ParkingSession.findOne({ where: { id } })

    res.status(200).json(parkingSession)
}

// create a new parking session
const createParkingSession = async (req, res) => {
    const { parkingspots_group_id } = req.body

    const newParkingSession = await ParkingSession.create({ parkingspots_group_id })

    res.status(200).json(newParkingSession)
}

// process payment on a specific parking session

const processPaymentOnParkingSession = async (req, res) => {
    const { id } = req.params
    const { payment } = req.body

    // get the parking session to check if any payment is already made
    const parkingSession = await ParkingSession.findOne({ where: { id } })

    // add up all payments
    const updatedPaidAmount = parkingSession.paid_amount + payment
    
    console.log("paid amount", parkingSession.paid_amount)
    console.log("payment", payment)
    console.log("updatedPaidAmount", updatedPaidAmount)

    // update the parking session with all payments
    const updatedParkingSession = await ParkingSession.update({ paid_amount: updatedPaidAmount }, {
        where: { id }
    })

    res.status(200).json(updatedParkingSession)
}

// end a specific parking session
const endParkingSession = async (req, res) => {
    const { id } = req.params
    const { session_ended } = req.body

    const updatedParkingSession = await ParkingSession.update({ session_ended }, {
        where: { id }
    })

    res.status(200).json(updatedParkingSession)
}

module.exports = {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    processPaymentOnParkingSession,
    endParkingSession
}
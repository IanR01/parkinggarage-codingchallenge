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

// calculate parking costs
const getParkingSessionCosts = async (req, res) => {
    const { id } = req.params
    
    // check if a datetime in the future has been send in the body for testing purposes, otherwise use the current datetime
    const now = new Date()
    let datetime
    if (req.body.futureDateTime) {
        const futureDateTime = new Date(req.body.futureDateTime)
        
        datetime = futureDateTime > now ? futureDateTime : now
    } else {
        datetime = now
    }

    // get the parking session
    const parkingSession = await ParkingSession.findOne({ where: { id } })

    // calculate the parking time
    const parkingTimeInMilliseconds = datetime - parkingSession.createdAt

    // pay per 5 minutes
    const paymentIntervalInMilliseconds = 300000
    const timeToPayInMilliseconds = paymentIntervalInMilliseconds * Math.ceil(parkingTimeInMilliseconds / paymentIntervalInMilliseconds)
    const timeToPayInMinutes = timeToPayInMilliseconds / 1000 / 60

    // TODO get the parkingspots_group details
    const startingRate = 100
    const hourlyRate = 400

    const parkingTimeCosts = (hourlyRate / 60) * timeToPayInMinutes

    // TODO get the electric charging costs
    const electricChargingTime = 6000
    const electricChargingHourlyRate = 800


    res.status(200).json({
        parkingTimeInMilliseconds,
        timeToPayInMilliseconds,
        timeToPayInMinutes,
        parkingTimeCosts
    })
}

// process payment on a specific parking session
const processParkingSessionPayment = async (req, res) => {
    const { id } = req.params
    const { payment } = req.body

    // get the parking session to check if any payment is already made
    const parkingSession = await ParkingSession.findOne({ where: { id } })

    // add up all payments
    const updatedPaidAmount = parkingSession.paid_amount + payment

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
    getParkingSessionCosts,
    processParkingSessionPayment,
    endParkingSession
}
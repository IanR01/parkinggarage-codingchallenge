const ParkingSession = require('../models/parkingSessionModel')
const { calcCostsBasedOnTime } = require('../utils/calcCosts')
const parkingSpotsGroups = require('../config/parkingSpotsGroups')


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
    
    // get the parking session
    const { id } = req.params
    const parkingSession = await ParkingSession.findOne({ where: { id } })

    // get the parkingspots group where the vehicle was checked in
    const parkingSpotsGroup = parkingSpotsGroups.find((parkingSpotsGroup) => parkingSpotsGroup.id == parkingSession.parkingspots_group_id)
    
    // check if there is a future datetime for testing purposes to use as end time
    const futureDateTime = req.body.futureDateTime ? new Date(req.body.futureDateTime) : null
    const now = new Date()
    const endDateTime = futureDateTime > now ? futureDateTime : now

    // calculate the parking time costs
    const parkingTimeCosts = calcCostsBasedOnTime(parkingSession.createdAt, endDateTime, parkingSpotsGroup.hourlyRate, parkingSpotsGroup.paymentIntervalInMinutes)
    const totalParkingCosts = parkingTimeCosts + parkingSpotsGroup.startingRate

    

    // TODO get the electric charging costs
    const electricChargingTime = 6000
    const electricChargingHourlyRate = 800


    res.status(200).json({
        parkingTimeCosts,
        totalParkingCosts
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
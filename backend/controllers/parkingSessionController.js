const ParkingSession = require('../models/parkingSessionModel')
const { calcParkingTimeCosts, calcElectricChargingCosts } = require('../utils/calcCosts')
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

    // calculate the parking time and electric charging costs
    const parkingTimeCosts = calcParkingTimeCosts(parkingSession, parkingSpotsGroup, endDateTime)
    const totalElectricChargingCosts = await calcElectricChargingCosts(parkingSession)
    const totalToPay = parkingTimeCosts + totalElectricChargingCosts

    res.status(200).json({
        parkingTimeCosts,
        totalElectricChargingCosts,
        totalToPay
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
    
    // get the parking session
    const { id } = req.params
    const parkingSession = await ParkingSession.findOne({ where: { id } })

    // get the parkingspots group where the vehicle was checked in
    const parkingSpotsGroup = parkingSpotsGroups.find((parkingSpotsGroup) => parkingSpotsGroup.id == parkingSession.parkingspots_group_id)
    
    // check if there is a future datetime for testing purposes to use as end time
    const futureDateTime = req.body.futureDateTime ? new Date(req.body.futureDateTime) : null
    const now = new Date()
    const endDateTime = futureDateTime > now ? futureDateTime : now

    // subtract the period that you're allowed to leave the garage after payment
    const dateTimeForPaymentCheck = endDateTime - new Date(parkingSpotsGroup.timeAfterPaymentInMinutes * 60 * 1000)
    console.log("dateTimeForPaymentCheck", dateTimeForPaymentCheck)

    // get the costs that at least should have been paid at this moment
    const parkingTimeCosts = calcParkingTimeCosts(parkingSession, parkingSpotsGroup, dateTimeForPaymentCheck)
    const totalElectricChargingCosts = await calcElectricChargingCosts(parkingSession)
    const totalToPay = parkingTimeCosts + totalElectricChargingCosts

    // check if the payment is sufficient
    const isPaymentSufficient = totalToPay < parkingSession.paid_amount

    if (isPaymentSufficient) {
        // end the parking session
        const updatedParkingSession = await ParkingSession.update({ session_ended: endDateTime }, {
            where: { id }
        })
    
        res.status(200).json(updatedParkingSession)
    } else {
        res.status(200).json({
            "error": "Payment is not sufficient",
            totalToPay,
            paid_amount: parkingSession.paid_amount
        })
    }
}

// get the available parking spots
const getAvailableParkingSpots = async (req, res) => {
    const { id } = req.params

    // get the amount of spots in this parking spots group
    const parkingSpotsGroup = parkingSpotsGroups.find((parkingSpotsGroup) => parkingSpotsGroup.id == id)

    // get the active parking sessions in this parking spots group
    const activeParkingSessions = await ParkingSession.findAll({ where: {
        parkingspots_group_id: id,
        session_ended: null
    }})

    // calculate the available parking spots in this parking spots group
    const availableParkingSpots = parkingSpotsGroup.numberOfSpots - activeParkingSessions.length

    res.status(200).json({
        totalNumberOfSpots: parkingSpotsGroup.numberOfSpots,
        numberOfSpotsOccupied: activeParkingSessions.length,
        availableParkingSpots
    })
}

module.exports = {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    getParkingSessionCosts,
    processParkingSessionPayment,
    endParkingSession,
    getAvailableParkingSpots
}
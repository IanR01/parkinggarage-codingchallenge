const ElectricChargingSession = require('../models/electricChargingSessionModel')
const electricChargingPoints = require('../config/electricChargingPoints')

const calcCostsBasedOnTime = (startTime, endTime, hourlyRate, paymentIntervalInMinutes = 1) => {
    
    // calculate time (in milliseconds)
    const timeInMilliseconds =  endTime - startTime

    // pay per x minutes
    const paymentIntervalInMilliseconds = paymentIntervalInMinutes * 60 * 1000
    const timeToPayInMilliseconds = paymentIntervalInMilliseconds * Math.ceil(timeInMilliseconds / paymentIntervalInMilliseconds)

    // calculate costs
    const costs = (hourlyRate / 60 / 60 / 1000) * timeToPayInMilliseconds
    return costs;
}

const calcParkingTimeCosts = (parkingSession, parkingSpotsGroup, endDateTime) => {
    // calculate the parking time costs
    const parkingTimeCosts = calcCostsBasedOnTime(
        parkingSession.createdAt,
        endDateTime,
        parkingSpotsGroup.hourlyRate,
        parkingSpotsGroup.paymentIntervalInMinutes
    )
    const totalParkingCosts = parkingTimeCosts + parkingSpotsGroup.startingRate
    return totalParkingCosts
}

const calcElectricChargingCosts = async (parkingSession) => {
    let totalElectricChargingCosts = 0
    // get all charging sessions for this parking session
    const electricChargingSessions = await ElectricChargingSession.findAll({ where: { parkingsession_id: parkingSession.id }})

    electricChargingSessions.forEach((electricChargingSession) => {
        // get the charging point used for this charging session
        const electricChargingPoint = electricChargingPoints.find((electricChargingPoint) => electricChargingPoint.id == electricChargingSession.chargingpoint_id)
        // calculate the charging time for this charging session
        const chargingCosts = calcCostsBasedOnTime(
            electricChargingSession.createdAt,
            electricChargingSession.session_ended,
            electricChargingPoint.hourlyRate
            )
            
        // add up the costs for all charging sessions
        totalElectricChargingCosts += chargingCosts
    })
    
    return totalElectricChargingCosts
}

module.exports = {
    calcCostsBasedOnTime,
    calcParkingTimeCosts,
    calcElectricChargingCosts
}
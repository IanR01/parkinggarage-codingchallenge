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

module.exports = {
    calcCostsBasedOnTime
}
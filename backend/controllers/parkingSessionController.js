
// get all parking-sessions
const getParkingSessions = (req, res) => {
    const parkingSessions = {
        "temporary test response": "getParkingSessions"
    }

    res.status(200).json(parkingSessions)
}

// get a specific parking session by id
const getParkingSession = (req, res) => {
    const parkingSession = {
        "temporary test response": "getParkingSession"
    }

    res.status(200).json(parkingSession)
}

// create a new parking session
const createParkingSession = (req, res) => {
    const parkingSession = {
        "temporary test response": "createParkingSession"
    }

    res.status(200).json(parkingSession)
}

// update a specific parking session
const updateParkingSession = (req, res) => {
    const parkingSession = {
        "temporary test response": "updateParkingSession"
    }

    res.status(200).json(parkingSession)
}

module.exports = {
    getParkingSessions,
    getParkingSession,
    createParkingSession,
    updateParkingSession
}
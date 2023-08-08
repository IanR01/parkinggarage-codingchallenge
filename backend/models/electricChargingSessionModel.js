require('dotenv').config()

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
)

sequelize.authenticate().then(() => {
    console.log('Successfully connected to database.')
}).catch((error) => {
    console.error('Unable to connect to the database:', error)
})

const ElectricChargingSession = sequelize.define('ElectricChargingSession', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    parkingsession_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chargingpoint_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    session_ended: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    timestamps: true
})

sequelize.sync().then(() => {
    console.log('ElectricChargingSession table created successfully');
}).catch((error) => {
    console.error('Unable to create table: ', error)
})

module.exports = ElectricChargingSession
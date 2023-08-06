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

const ParkingSession = sequelize.define('ParkingSession', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    parkingspots_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paid_amount: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false,
        defaultValue: "0.00"
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
    console.log('ParkingSession table created successfully');
}).catch((error) => {
    console.error('Unable to create table: ', error)
})
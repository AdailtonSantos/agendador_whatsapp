const { DataTypes } = require('sequelize')
const db = require('../services/db/connection.js')

const schedulecontact = db.define('ScheduleContact', {
    schedule_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = schedulecontact
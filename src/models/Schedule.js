const { DataTypes } = require('sequelize')
const db = require('../services/db/connection.js')

const schedule = db.define('Schedule', {
    title: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instance: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recurrent: {
        type: DataTypes.STRING(3),
        allowNull: false
    },
    recurrenceInDays: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
})

module.exports = schedule
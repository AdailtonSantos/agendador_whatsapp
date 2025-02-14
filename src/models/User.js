const { DataTypes } = require('sequelize')
const db = require('../services/db/connection.js')

const user = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instance: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
})

module.exports = user
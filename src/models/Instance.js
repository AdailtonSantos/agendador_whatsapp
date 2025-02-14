const { DataTypes } = require('sequelize')
const db = require('../services/db/connection.js')

const instance = db.define('Instance', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = instance
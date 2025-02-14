const User = require('../models/User.js')
const Instance = require('../models/Instance.js');
const bcrypt = require('bcrypt');
const { getInstanceInfo } = require('./getInstanceInfo.js');
require('dotenv').config()

async function createMainInstance() {
    const name = process.env.INITIAL_INSTANCE_NAME
    
    try {
        const { token } = await getInstanceInfo(name)
        const [instance, created] = await Instance.findOrCreate({
            where: { name: name },
            defaults: { name, token }
        })
        if (!created) {
            return
        }
        return instance
    } catch (err) {
        console.log('Erro rota POST INSTANCE:', err)
    }
}

async function createAdminUser() {
    try {
        await createMainInstance()
        const name = process.env.ADMINUSER
        const username = process.env.ADMIN_USERNAME
        const password = process.env.ADMIN_PASS
        const instance = process.env.INITIAL_INSTANCE_NAME
        const encryptedPassword = await bcrypt.hash(password, 10)
        const [user, created] = await User.findOrCreate({
            where: { username: username },
            defaults: { name, username, password: encryptedPassword, instance }
        })
        if (!created) {
            return
        }
        return user
    } catch (err) {
        console.log(err)
    }
}

module.exports = { createAdminUser }
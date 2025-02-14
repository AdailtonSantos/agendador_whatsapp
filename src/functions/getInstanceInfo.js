const axios = require('axios')
require('dotenv').config()

async function getInstanceInfo(name) {
    try {
        const { data: instances } = await axios.get(process.env.APIURL + '/instance/fetchInstances?instanceName=' + name, {
            headers: {
                apiKey: process.env.APIGLOBALKEY
            }
        })

        const token = instances.instance.apikey ? instances.instance.apikey : process.env.APIGLOBALKEY
        return { token }

    } catch (err) {
        if(err.response.data.response.message[0].includes('Instance')){
            return 'Instância não encontrada no evolution'
        }
    }
}

module.exports = {
    getInstanceInfo
}
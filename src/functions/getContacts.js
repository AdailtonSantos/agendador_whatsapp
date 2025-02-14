const axios = require('axios')
require('dotenv').config()

async function getContacts(instance, apiKey) {
    const response = await axios.post(`${process.env.APIURL}/chat/findContacts/${instance}`, {}, {
        headers: {
            'apiKey': apiKey
        }
    })

    const contacts = response.data.map(({ __v, owner, _id, profilePictureUrl, ...rest }) => rest);

    return contacts;

}

module.exports = {
    getContacts
}
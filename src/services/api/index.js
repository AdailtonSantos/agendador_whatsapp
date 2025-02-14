const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors')
const conn = require('../db/connection.js');
const verifySchedule = require('../../functions/send.js')
const getRoutes = require('./routes/get.js')
const postRoutes = require('./routes/post.js')
const putRoutes = require('./routes/put.js')
const deleteRoutes = require('./routes/delete.js')
const { createAdminUser } = require('../../functions/createInitialUser.js');
const helmet = require('helmet');
require('dotenv').config()

app.use(cors())

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  // Você pode configurar outros middlewares do Helmet aqui
}));

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static('public'));

postRoutes(app)
putRoutes(app)
getRoutes(app)
deleteRoutes(app)

const date = new Intl.DateTimeFormat('pt-BR', { timezone: 'America/São Paulo' }).format(new Date())
const time = new Date().toLocaleTimeString()
verifySchedule(date, time)


setInterval(() => {
  const date = new Intl.DateTimeFormat('pt-BR', { timezone: 'America/São Paulo' }).format(new Date())
  const time = new Date().toLocaleTimeString()
  verifySchedule(date, time)
}, 60000)


// const options = {
//   key: fs.readFileSync(process.env.PATH_PRIVKEY),
//   cert: fs.readFileSync(process.env.PATH_CERTIFICATE),
// };


conn.sync({ alter: true }).then(() => {

  // https.createServer(options, app).listen(8081, () => {
  //   console.log('Servidor HTTPS rodando na porta 8081');
  // });

  app.listen(8081, () => {
    console.log("Rodando na porta 8081")
  })

  createAdminUser()
}).catch(err => {
  console.log('Ocorreu um erro na sincronização:', err)
})
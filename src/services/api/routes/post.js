const Schedule = require('../../../models/Schedule.js');
const ScheduleContact = require('../../../models/ScheduleContact.js');
const Instance = require('../../../models/Instance.js');
const User = require('../../../models/User.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const chalk = require('chalk')
const { getInstanceInfo } = require('../../../functions/getInstanceInfo.js');
const upload = require('../../../functions/upload.js');
const authenticateToken = require('../../auth/jwt.js');
const xss = require("xss");

module.exports = (app) => {

  app.post('/register', authenticateToken, async (req, res) => {
    const name = xss(req.body.name)
    const username = xss(req.body.username)
    const password = xss(req.body.password)
    const instance = xss(req.body.instance)

    const encryptedPassword = await bcrypt.hash(password, 10)
    try {
      const [user, created] = await User.findOrCreate({
        where: { username: username },
        defaults: { name, username, password: encryptedPassword, instance }
      })
      if (!created) {
        res.status(403).json({ message: 'Nome de usuário já utilizado, por favor, experimente outro' })
        return
      }
      res.json(user)
    } catch (err) {
      console.log(chalk.red('ERRO ROTA REGISTER USER', err))
      res.status(500).json({ error: err })
    }
  })

  app.post('/login', async (req, res) => {
    const username = xss(req.body.username)
    const password = xss(req.body.password)

    const user = await User.findOne({ where: { username } });
    if (user == null) {
      return res.status(403).json({ error: 'Não autorizado' });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({ username: user.username, instance: user.instance }, process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ user: user.username, instance: user.instance, token: accessToken });
      } else {
        res.status(403).json({ error: 'Não autorizado' });
      }
    } catch (err) {
      console.log(chalk.red('Erro rota POST LOGIN:', err))
      res.status(500).json({ serverError: 'Não autorizado' });
    }
  });

  app.post('/instance', authenticateToken, async (req, res) => {
    const name = xss(req.body.name)

    try {
      const response = await getInstanceInfo(name)
      if (response === 'Instância não encontrada no evolution') {
        return res.status(404).json({ message: response })
      }

      const { token } = response

      const [instance, created] = await Instance.findOrCreate({
        where: { name: name },
        defaults: { name, token }
      })
      if (!created) {
        return res.status(400).json({ message: 'Esta instância já existe no sistema' })
      }
      res.status(200).json({ message: 'Instância criada com sucesso' })
    } catch (err) {
      console.log(chalk.red('Erro rota POST INSTANCE:', err))
      res.status(500).json({ error: err })
    }
  })

  app.post('/schedule', authenticateToken, upload.single('file'), async (req, res) => {
    if (req.fileValidationError) {
      return res.status(403).json({ message: 'Formato de arquivo não permitido' })
    }

    const recurrenceInDays = req.body.recurrenceInDays
    if (recurrenceInDays && isNaN(Number(recurrenceInDays))) {
      return res.status(400).json("Dias da recorrência deve ser um número")
    }

    const message = xss(req.body.message)
    const title = xss(req.body.title)
    const date = xss(req.body.date)
    const user = xss(req.body.user)
    const instance = xss(req.body.instance)
    const recurrent = xss(req.body.recurrent)
    const contacts = JSON.parse(req.body.contacts)

    let filePath;
    if (req.file !== undefined && req.file !== null) {
      filePath = req.file.originalname
    } else if (req.newFileName) {
      filePath = req.newFileName
    } else {
      filePath = null
    }

    try {
      const schedule = await Schedule.create({ title, message, date, filePath, user, instance, recurrent, recurrenceInDays })
      ScheduleContact.bulkCreate(contacts.map(contato => ({
        schedule_id: schedule.id,
        name: contato.pushName,
        number: contato.id.split('@')[0]
      })),
        { fields: ["schedule_id", "name", "number"] }
      )

      res.status(200).json(schedule)
    } catch (err) {
      console.log(chalk.red('Erro rota POST CREATE SCHEDULE:', err))
      res.status(500).json({ error: 'Erro' })
    }
  })

  app.post('/duplicate/schedule', authenticateToken, async (req, res) => {

    const schedule = req.body
    const id = schedule.id
    if (id && isNaN(Number(id))) {
      return res.status(400).json("Id deve ser um número")
    }

    try {
      const oldSchedule = await Schedule.findByPk(id);

      const newScheduledData = oldSchedule.get({ plain: true });
      newScheduledData.id = null;

      const newScheduled = await Schedule.create(newScheduledData);

      ScheduleContact.bulkCreate(schedule.contacts.map(contato => ({
        schedule_id: newScheduled.dataValues.id,
        name: contato.name,
        number: contato.number
      })),
        { fields: ["schedule_id", "name", "number"] }
      )

      res.status(200).json({ success: "Registro duplicado", data: newScheduled })
    } catch (err) {
      console.log(chalk.red('Erro rota POST DUPLICATE SCHEDULE:', err))
      res.status(500).json({ error: 'Erro', message: err.response })
    }
  })

}
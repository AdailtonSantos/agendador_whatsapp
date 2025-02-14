const { getContacts } = require('../../../functions/getContacts.js');
const Schedule = require('../../../models/Schedule.js');
const ScheduleContacts = require('../../../models/ScheduleContact.js');
const User = require('../../../models/User.js');
const Instance = require('../../../models/Instance.js');
const moment = require('moment');
const authenticateToken = require('../../auth/jwt.js');
const chalk = require('chalk');

module.exports = (app) => {

  app.get('/schedule', authenticateToken, async (req, res) => {
    try {
      const response = await Schedule.findAll({ where: {
        instance: req.user.instance
      }})
      const schedules = await Promise.all(response.map(async (schedule) => {
        const arrayScheduleContacts = await ScheduleContacts.findAll({
          where: {
            schedule_id: schedule.id
          }
        })
        const schedulesContacts = arrayScheduleContacts.map(({ dataValues }) => dataValues);
        return {
          ...schedule.dataValues,
          contacts: schedulesContacts,
          date: moment(schedule.date).format('DD/MM/YYYY [às] HH:mm'),
          normalDate: moment(schedule.date).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm')
        };
      }))
      res.status(200).json(schedules)
    } catch (err) {
      console.log(chalk.red('Erro rota GET SCHEDULES:', err))
      res.status(500).json({ Error: `Ocorreu um erro: ${err}` })
    }
  })

  app.get('/instances', authenticateToken, async (req, res) => {
    
    if(req.user.instance !== 'chat'){
      return res.status(403).json({ message: "Ação não permitida" })
    }

    try {
      const instances = await Instance.findAll()
      res.status(200).json(instances)
    } catch (err) {
      console.log(chalk.red('Erro rota GET INSTANCES:', err))
      res.status(500).json({ Error: `Ocorreu um erro: ${err}` })
    }
  })

  app.get('/edit/instances', authenticateToken, async (req, res) => {
    if(req.user.instance !== 'chat'){
      return res.status(403).json({ message: "Ação não permitida" })
    }

    try {
      const [instances, users] = await Promise.all([
        Instance.findAll(),
        User.findAll({
          attributes: ['id', 'instance', 'name']
        }),
      ]);
      res.status(200).json({ instances, users })
    } catch (err) {
      console.log(chalk.red('Erro rota GET INSTANCES EDIT:', err))
      res.status(500).json({ Error: `Ocorreu um erro: ${err}` })
    }
  })

  app.get('/contacts', authenticateToken, async (req, res) => {
    const instance = await Instance.findOne({ where: { name: req.user.instance } })
    try {
      const contacts = await getContacts(instance.name, instance.token)
      res.status(200).json(contacts)
    } catch (err) {
      console.log(chalk.red('Erro rota GET CONTACTS:', err))
      res.status(500).json({ error: `Ocorreu um erro ao buscar os contatos da conta: ${err}` })
    }
  })
}
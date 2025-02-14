const fs = require('fs');
const xss = require('xss');
const Schedule = require('../../../models/Schedule.js');
const User = require('../../../models/User.js');
const ScheduleContact = require('../../../models/ScheduleContact.js');
const authenticateToken = require("../../auth/jwt.js")

module.exports = (app) => {

  app.delete('/schedule/:id', authenticateToken, async (req, res) => {

    const id = xss(req.params.id)
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({error: "Apenas números são permitidos nesta ação"})
    }

    const thisSchedule = await Schedule.findOne({
      where: {
        id: id
      }
    })

    if(thisSchedule.dataValues.instance !== req.user.instance){
      return res.status(403).json({ error: "Ação não permitida" })
    }

    if (thisSchedule.dataValues.filePath !== null) {
      fs.unlink(`../../public/${thisSchedule.dataValues.filePath}`, (err) => {
        if (err) throw err;
      });
    }

    try {
      await Schedule.destroy({
        where: {
          id: id
        }
      })

      await ScheduleContact.destroy({
        where: {
          schedule_id: id
        }
      })

      res.status(200).json('Sucesso')
    } catch (err) {
      console.log('Erro rota DELETE SCHEDULE:', err)
      res.status(500).json('Erro')
    }
  })

  app.delete('/instance/:name', authenticateToken, async (req, res) => {
    const name = req.params.name
    try {
      await Instance.destroy({
        where: {
          name: name
        }
      })
      res.status(200).json('Sucesso')
    } catch (err) {
      console.log('Erro rota DELETE INSTANCE:', err)
      res.status(500).json({ error: 'Erro ao deletar conta' })
    }
  })

  app.delete('/user/:id', authenticateToken, async (req, res) => {
    const id = xss(req.params.id)
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({error: "Apenas números são permitidos nesta ação"})
    }

    try {
      await User.destroy({
        where: {
          id: id
        }
      })
      res.status(200).json('Sucesso')
    } catch (err) {
      console.log('Erro rota DELETE USER:', err)
      res.status(500).json({ error: 'Erro ao deletar usuario' })
    }
  })
}
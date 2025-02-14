const Schedule = require('../../../models/Schedule.js');
const ScheduleContact = require('../../../models/ScheduleContact.js');
const fs = require('fs')
const chalk = require('chalk')
const upload = require('../../../functions/upload.js');
const authenticateToken = require('../../auth/jwt.js');
const xss = require("xss");

module.exports = (app) => {

  app.put('/schedule', authenticateToken, upload.single('file'), async (req, res) => {
    if (req.fileValidationError) {
      return res.status(403).json({ message: 'Formato de arquivo não permitido' })
    }
    let recurrenceInDays = xss(req.body.recurrenceInDays)

    if (isNaN(Number(recurrenceInDays))) {
      return res.status(400).json("Dias da recorrência deve ser um número")
    }

    const id = xss(req.body.id)
    const message = xss(req.body.message)
    const title = xss(req.body.title)
    const date = xss(req.body.date)
    const oldFilePath = xss(req.body.oldFilePath)
    const recurrent = xss(req.body.recurrent)

    if (recurrent === 'Não') {
      recurrenceInDays = 0
    }

    const removeList = JSON.parse(req.body.removeList)
    const contacts = JSON.parse(req.body.contacts)

    let filePath;

    if (req.file && oldFilePath !== 'null') {
      filePath = req.file.originalname

      fs.unlink(`../../public/${oldFilePath}`, (err) => {
        if (err) throw err;
      });
    } else if (!req.file && oldFilePath !== 'null') {
      filePath = oldFilePath
    }

    try {
      await Schedule.update({
        title: title,
        message: message,
        date: date,
        recurrent: recurrent,
        filePath: filePath,
        recurrenceInDays: recurrenceInDays
      }, {
        where: {
          id: id
        }
      })

      ScheduleContact.destroy({
        where: {
          schedule_id: id,
          name: removeList
        }
      })

      ScheduleContact.bulkCreate(contacts.map(contato => ({
        schedule_id: id,
        name: contato.pushName,
        number: contato.id.split('@')[0]
      })),
        { fields: ["schedule_id", "name", "number"] }
      )

      res.status(200).json({ message: 'Atualizado com sucesso' })
    } catch (err) {
      console.log(chalk.red('Erro rota POST UPDATE SCHEDULE:', err))
      res.status(500).json('Erro')
    }
  })

}
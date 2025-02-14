const Schedule = require('../models/Schedule.js');
const Instance = require('../models/Instance.js');
const ScheduleContact = require('../models/ScheduleContact.js');
const axios = require('axios');
const fs = require('fs');
const mime = require('mime-types');
const chalk = require('chalk');

async function getSchedulesToSend(date, time, schedules) {

  console.log('Checando se existem agendamentos...')

  const isDate = schedules.filter(reminder => {
    const scheduleDay = String(reminder.date.getDate()).padStart(2, '0')
    const scheduleMonth = String(reminder.date.getMonth() + 1).padStart(2, '0')
    const scheduleHour = String(reminder.date.getHours()).padStart(2, '0')
    const scheduleMinute = String(reminder.date.getMinutes()).padStart(2, '0')
    const [day, month] = date.split('/');
    const [timePart, period] = time.split(' '); // timePart = "hh:mm", period = "AM" ou "PM"
    const [actualHour, actualMinute] = timePart.split(':');

    let convertedHour = parseInt(actualHour, 10);
    if (period === 'PM' && convertedHour !== 12) {
      convertedHour += 12;
    } else if (period === 'AM' && convertedHour === 12) {
      convertedHour = 0;
    }
    const actualHour24 = String(convertedHour).padStart(2, '0');
    return scheduleDay === day && scheduleMonth === month && scheduleHour === actualHour24 && scheduleMinute === actualMinute;
  })
  return isDate
}

async function getScheduleContacts(id) {
  const contacts = await ScheduleContact.findAll({
    where: {
      schedule_id: id
    }
  })

  return contacts
}

async function verifySchedule(date, time) {
  const schedules = await Schedule.findAll()
  if (!schedules || schedules.length === 0) {
    return
  }

  const isDate = await getSchedulesToSend(date, time, schedules);
  if (isDate.length !== 0) {
    for (const schedule of isDate) {
      const instance = await Instance.findOne({ where: { name: schedule.instance } });
      const token = instance.token;
      const contacts = await getScheduleContacts(schedule.id);
      const isRecurrent = schedule.recurrent;

      const delay = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };

      if (isRecurrent === 'Sim') {
        await deleteAndRecreateSchedule(schedule.id);
      }

      // Função para envio de mensagens
      const sendMessages = async () => {
        const batchSize = 5;
        for (let i = 0; i < contacts.length; i += batchSize) {
          console.log(`Iniciando disparos para a instância ${instance.name}...`);
          const batch = contacts.slice(i, i + batchSize);
          await Promise.all(
            batch.map(contact => {
              if (schedule.filePath === null || schedule.filePath === 'null') {
                return sendTextMessage(contact.dataValues.number, token, schedule.message, instance.name);
              } else {
                return sendMediaMessage(contact.dataValues.number, token, schedule.filePath, schedule.message, instance.name);
              }
            })
          );
          await delay(60000);
        }
      };

      // Dispara as mensagens para a instância específica em paralelo
      sendMessages().catch(err => console.error(err));
    }
  }
}


async function deleteAndRecreateSchedule(id) {
  const schedule = await Schedule.findOne({ where: { id: id } })

  const message = schedule.message
  const filePath = schedule.filePath
  const user = schedule.user
  const instance = schedule.instance
  const recurrent = schedule.recurrent
  const recurrenceInDays = schedule.recurrenceInDays

  let date = new Date(schedule.date)
  const newDate = new Date(date.setDate(date.getDate() + recurrenceInDays))

  await Schedule.update({ message, date: newDate, filePath, user, instance, recurrent, recurrenceInDays }, {
    where: {
      id: schedule.id
    }
  })
}


async function sendTextMessage(number, token, message, instance) {
  console.log('Enviando mensagem...')
  console.log('Enviando para:', number, 'Conteúdo:', message, 'Instância:', instance)

  try {
    await axios.post(`${process.env.APIURL}/message/sendText/${instance}`, {
      number: number,
      textMessage: {
        text: message
      },
    }, {
      headers: {
        'apiKey': token,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.log(err)
  }
}

function convertFileToBase64(filePath) {
  filePath = '../../public/' + filePath
  const file = fs.readFileSync(filePath);
  return file.toString('base64');
}

async function sendMediaMessage(number, token, filePath, message, instance) {
  let fileType = mime.lookup(filePath);
  if (fileType.includes('application')) {
    fileType = 'document'
  } else if (fileType.includes('image')) {
    fileType = 'image'
  } else if (fileType.includes('video')) {
    fileType = 'video'
  }
  const base64File = convertFileToBase64(filePath);

  try {
    await axios.post(`${process.env.APIURL}/message/sendMedia/${instance}`, {
      number: number,
      mediaMessage: {
        mediatype: fileType,
        fileName: filePath,
        caption: message,
        media: base64File
      },
    }, {
      headers: {
        'apiKey': token,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.log(chalk.bgRed(err))
  }
}


module.exports = verifySchedule
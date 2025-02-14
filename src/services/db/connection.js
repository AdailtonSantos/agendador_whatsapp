const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    'schedule_messages',
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST, // Nome do serviço MySQL no Docker Compose
        dialect: 'mysql',
        port: process.env.DB_PORT || '3306',
        logging: false
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado ao banco de dados.');
    } catch (err) {
        console.error('Erro ao conectar no banco:', err);
    }
})();

module.exports = sequelize;

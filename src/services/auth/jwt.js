const jwt = require('jsonwebtoken');
require("dotenv").config()

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token == null) return res.status(403).json({ tokenError: 'Requisição não autorizada, faça o login primeiro.' });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ tokenError: 'Requisição não autorizada, faça o login primeiro.' });
      req.user = user;
      next();
    });
  };

  module.exports = authenticateToken
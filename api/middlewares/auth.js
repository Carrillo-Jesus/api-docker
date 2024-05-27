const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No autorizado' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Error al autenticar, por favor inicie sesión nuevamente' });
    }
    req.user = decoded;
    next();
  });
};

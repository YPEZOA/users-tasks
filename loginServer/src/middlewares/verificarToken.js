const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]

  if (!req.headers.authorization) { return res.status(401).json({
    status: 0,
    message: 'Unauthorized request'
  })}

  if(token === 'null') {
    return res.status(401).json({
      status: 0,
      message: 'Unauthorized request'
    })
  }

  const payload = jwt.verify(token, 'secretkey')

  req.userId = payload._id;
  next();
}

module.exports = { verifyToken }

const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.id; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
module.exports = authMiddleware;




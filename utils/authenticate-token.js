const jwt = require('jsonwebtoken');
const apiResponse = requre('authResponse')

exports.authenticateToken(req, res, next) {
    const authHeader = req.header['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    })
}
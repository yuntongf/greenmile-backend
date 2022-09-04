const jwt = require("jsonwebtoken");

module.exports = function (req, res, next){
   const token = req.header('x-token');
   if (!token) return res.status(401).send('Please login to access...');
   try {
      jwt.verify(token, "jwtPrivateKey");
   } catch (ex) {
      res.status(400).send("Invalid token");
   }
}


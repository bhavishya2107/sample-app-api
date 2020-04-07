const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  generateJWT: async (user) => {
    var payload = { userId: user.id, email: user.email, password: user.password};
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  },
  verifyToken: async (req, res, next) => {
    var token = req.headers["authorization"] || "";
    if (token) {
      try {
        var payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload;
        req.user.token = token;
        next();
      } catch (error) {
        res.json({ message: "invalid token", error });
      }
    } else {
      res.json({ msg: "Token required" });
    }
  },
  updatePW: (user) => {
    var hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  },
};

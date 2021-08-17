const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 1. check for JWT

    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized 1");
    }

    const payload = jwt.verify(jwtToken, process.env.SECRET_OR_KEY);

    req.user = payload.user;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized 2");
  }
};

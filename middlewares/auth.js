var jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../model/user");

async function auth(req, res, next) {
  let token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");
  try {
    let user = jwt.verify(token, config.get("jwtPrivateKey"));
    let a = user;
    req.user = await User.findById(user._id);
  } catch (error) {
    return res.status(401).send("Token Invalid");
  }
  next();
}

module.exports = auth;

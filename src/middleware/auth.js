const jwt = require("jsonwebtoken");
const Register = require("../models/userregister");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(
      token,
      "mynameisramavathnishanthrathodiamafullstackwebdeveloper"
    );
    console.log(verifyUser);

    const user = await Register.findOne({ _id: verifyUser._id });
    console.log(user.name);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send(e);
  }
};
module.exports = auth;

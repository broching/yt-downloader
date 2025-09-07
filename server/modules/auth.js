const { verify } = require('jsonwebtoken');
const constants = require("../modules/constants");
require('dotenv').config();

const validateToken = (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").split(" ")[1];
    if (!accessToken) {
      return res.sendStatus(401);
    }

    req.user = verify(accessToken, constants.APP_SECRET);
    return next();
  }
  catch (err) {
    return res.sendStatus(401);
  }
}


module.exports = { validateToken};

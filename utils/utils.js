const jwt = require("jsonwebtoken");
const my_secret_key =
  "sdfsdffss@#%$@#$SDFSDFSFS#@$#%#$dfssggu67765756sfsdfsdSDFSFSDQW@$dfhfdgh(()^^%&$#$#$DFGDFGDRgdg3534#$#$#$.,;sdfsdf345324";
const userModel = require("../models/userModel");

function generateAccessToken(data) {
  return jwt.sign({ data }, my_secret_key, { expiresIn: "24h" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, my_secret_key, (err, user) => {
      if (err) {
        //return res.sendStatus(403);
        return res.json({
          status: 403,
          msg: "Not Allowed",
        });
      }

      console.log("User found in token : " + user.data.email);

      userModel.findOne({ email: user.data.email }, function (err, newUser) {
        if (err) return res.json({ status: 501, data: "User not found!" });

        req.user = newUser;
        next();
      });
    });
  } else {
    //res.sendStatus(401);
    return res.json({
      status: 401,
      msg: "Unauthorized",
    });
  }
}

function getCurrentDate() {
  let date_ob = new Date();

  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();

  //   // prints date in YYYY-MM-DD format
  //   console.log(year + "-" + month + "-" + date);

  // prints date & time in YYYY-MM-DD HH:MM:SS format
  let dateString =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return dateString;

  // // prints time in HH:MM format
  // console.log(hours + ":" + minutes);
}

module.exports = { getCurrentDate, generateAccessToken, authenticateToken };

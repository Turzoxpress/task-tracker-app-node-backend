const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
//const port = 5001;
const port = 3000;

/*
Set the cors option to access this server from outside of the world. Don't forget to limit this access when you are in production mode
*/

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/*
It will handle large amount of json body data to receive and transfer over request
*/
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

//Our database connection helper
const dbConn = require("./db/database");

// Our user model
const userModel = require("./models/userModel");

require("./routes")(app);

//start node server on 3000 port
app.listen(port, () => {
  console.log(`Server started successfully on port ${port}`);
});

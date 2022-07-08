var mongoose = require("mongoose");
var db = require("../db/database");

// create an schema
var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  last_login: String,
});

userTable = mongoose.model("users", userSchema, "users");

module.exports = userTable;

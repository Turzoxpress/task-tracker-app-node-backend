var mongoose = require("mongoose");
var db = require("../db/database");

// create an schema
var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "employee", "user"],
  },
  last_login: String,
  created_at: Date,
  modified_at: Date,
});

userTable = mongoose.model("users", userSchema, "users");

module.exports = userTable;

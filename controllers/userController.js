const mongoose = require("mongoose");

const dbConn = require("../db/database");
const userModel = require("../models/userModel");

const bcrypt = require("bcryptjs");

const utils = require("../utils/utils");

module.exports = {
  get: {},
  post: {
    registerNewUser: async (req, res) => {
      if (!Object.keys(req.body).length) {
        return res.json({ status: 501, message: "No body provided" });
      }

      const { name, email, password } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const userResult = await userModel.findOne({ email: email });

      if (userResult) {
        return res.json({
          status: 404,
          message: "User alreay exists with this email",
        });
      }

      data = {
        name: name,
        email: email,
        password: hash,
      };

      userModel
        .create(data)
        .then((result) => {
          return res.json({
            status: 200,
            message: "User created successfully",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({ status: 500, message: "Error " + err });
        });
    },

    loginUser: async (req, res) => {
      if (!Object.keys(req.body).length) {
        return res.json({ status: 501, message: "No body provided" });
      }

      const { email, password } = req.body;

      // Check the user first
      const userResult = await userModel.findOne({ email: email });

      if (!userResult) {
        return res.json({
          status: 404,
          message: "User not available with this email",
        });
      }

      const preHash = userResult.password;
      if (bcrypt.compareSync(password, preHash)) {
        const userUpdateResult = await userModel.updateOne(
          { email: email },
          {
            $set: {
              last_login: utils.getCurrentDate(),
            },
          }
        );

        let jsonToken = utils.generateAccessToken(userResult);

        return res.json({
          status: 200,
          message: "Login successful!",
          token: jsonToken,
        });
      } else {
        return res.json({ status: 503, message: "Invalid credentials!" });
      }
    },
  },
};

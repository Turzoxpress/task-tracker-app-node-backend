const mongoose = require("mongoose");

const dbConn = require("../db/database");
const userModel = require("../models/userModel");

const bcrypt = require("bcryptjs");

const utils = require("../utils/utils");

module.exports = {
  get: {},
  post: {
    deleteUser: async (req, res) => {
      const role = req.user.role;
      if (role != "admin") {
        return res.json({
          status: 501,
          message: "You are not authorized!",
        });
      }

      const user_id = req.body.user_id;

      userModel
        .deleteOne({ _id: mongoose.Types.ObjectId(user_id) })
        .then((result) => {
          return res.json({
            status: 200,
            message: "User deleted!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error " + err,
          });
        });
    },
    updateUserRole: async (req, res) => {
      const role = req.user.role;
      // if (role != "admin") {
      //   return res.json({
      //     status: 501,
      //     message: "You are not authorized!",
      //   });
      // }

      const user_id = req.body.user_id;
      const new_role = req.body.role;

      userModel
        .updateOne(
          { _id: mongoose.Types.ObjectId(user_id) },
          {
            $set: {
              role: new_role,
              modified_at: utils.getCurrentDate(),
            },
          }
        )
        .then((result) => {
          return res.json({
            status: 200,
            message: "User role updated successfully!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error " + err,
          });
        });
    },
    getAllUsers: async (req, res) => {
      const role = req.user.role;

      if (role != "admin") {
        return res.json({
          status: 501,
          message: "You are not authorized!",
        });
      }

      const options = {
        // sort in descending (-1) order by rating
        //sort : { rating: -1 },
        // omit the first two documents
        sort: { created_at: -1 },
        // skip: limit * pageNo,
        // limit: limit,
      };

      userModel
        .find(null, null, options)
        .then((result) => {
          return res.json({
            status: 200,
            count: result.length,
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error " + err,
          });
        });
    },
    registerNewUser: async (req, res) => {
      if (!Object.keys(req.body).length) {
        return res.json({ status: 501, message: "No body provided" });
      }

      const { name, email, password } = req.body;
      let role = "user";

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      //----------------------
      const userCount = await userModel.find();

      if (userCount && userCount.length > 0) {
        //console.log("User count : " + userCount);
      } else {
        console.log("No user created yet! Creating an admin first...");
        role = "admin";
      }

      //return res.json({ data: userCount });

      //------------------------------------

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
        role: role,
        created_at: utils.getCurrentDate(),
        modified_at: utils.getCurrentDate(),
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
          name: userResult.name,
          role: userResult.role,
          token: jsonToken,
        });
      } else {
        return res.json({ status: 503, message: "Invalid credentials!" });
      }
    },
  },
};

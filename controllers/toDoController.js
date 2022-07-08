const mongoose = require("mongoose");

const dbConn = require("../db/database");
const userModel = require("../models/userModel");
const toDoModel = require("../models/toDoModel");

const bcrypt = require("bcryptjs");

const utils = require("../utils/utils");

module.exports = {
  get: {},
  post: {
    addNewTask: async (req, res, next) => {
      const task_name = req.body.task_name;
      const status = "created";
      const created_by = req.body.created_by;

      const created_at = utils.getCurrentDate();
      const modified_at = utils.getCurrentDate();

      toDoModel
        .create({
          task_name,
          status,
          created_by,
          created_at,
          modified_at,
        })
        .then((result) => {
          return res.json({
            status: 200,
            message: "Task added successfully!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error" + err,
          });
        });
    },
    getAllTasks: async (req, res, next) => {
      toDoModel
        .find({ status: { $ne: "deleted" } })
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
            message: "Erro" + err,
          });
        });
    },
    changeTaskStatus: async (req, res, next) => {
      const id = req.body.id;
      const status = req.body.status;
      const modified_by = req.body.modified_by;

      toDoModel
        .updateOne(
          { _id: mongoose.Types.ObjectId(id) },
          {
            $set: {
              status: status,
              modified_by: modified_by,
            },
          }
        )
        .then((result) => {
          return res.json({
            status: 200,
            message: "Task modified successfully!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });
    },

    deleteTask: async (req, res, next) => {
      const id = req.body.id;
      const modified_by = req.body.modified_by;

      toDoModel
        .updateOne(
          { _id: mongoose.Types.ObjectId(id) },
          {
            $set: {
              status: "deleted",
              modified_by: modified_by,
            },
          }
        )
        .then((result) => {
          return res.json({
            status: 200,
            message: "Task deleted successfully!",
            data: result,
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Erro" + err,
          });
        });

      //   toDoModel
      //     .deleteOne({ _id: mongoose.Types.ObjectId(id) })
      //     .then((result) => {
      //       return res.json({
      //         status: 200,
      //         message: "Deleted successfully!",
      //         data: result,
      //       });
      //     })
      //     .catch((err) => {
      //       return res.json({
      //         status: 500,
      //         message: "Erro" + err,
      //       });
      //     });
    },
  },
};

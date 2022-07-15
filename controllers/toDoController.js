const mongoose = require("mongoose");

const dbConn = require("../db/database");
const userModel = require("../models/userModel");
const toDoModel = require("../models/toDoModel");

const bcrypt = require("bcryptjs");

const utils = require("../utils/utils");

module.exports = {
  get: {},
  post: {
    getTotalTaskCount: async (req, res, next) => {
      toDoModel
        .find()
        .then((result) => {
          //---------"created", "working", "completed", "deleted"
          let created = 0;
          let working = 0;
          let completed = 0;
          let deleted = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i].status === "created") {
              created += 1;
            } else if (result[i].status === "working") {
              working += 1;
            } else if (result[i].status === "completed") {
              completed += 1;
            } else if (result[i].status === "deleted") {
              deleted += 1;
            }
          }

          let total = created + working + completed + deleted;

          return res.json({
            status: 200,
            data: {
              total: total,
              created: created,
              working: working,
              completed: completed,
              deleted: deleted,
            },
          });
        })
        .catch((err) => {
          return res.json({
            status: 500,
            message: "Error" + err,
          });
        });
    },
    addNewTask: async (req, res, next) => {
      const task_name = req.body.task_name;
      const task_description = req.body.task_description;
      const status = "created";
      const created_by = req.body.created_by;

      const created_at = utils.getCurrentDate();
      const modified_at = utils.getCurrentDate();

      toDoModel
        .create({
          task_name,
          task_description,
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
    getAllTasksStatus: async (req, res, next) => {
      const status = req.params.status;
      // if (status === "deleted") {
      //   return res.json({
      //     status: 200,
      //     message:
      //       "Sorry! You do not have permission to view this type of data!",
      //   });
      // }

      const options = {
        // sort in descending (-1) order by rating
        //sort : { rating: -1 },
        // omit the first two documents
        sort: { modified_at: -1 },
        // skip: limit * pageNo,
        // limit: limit,
      };

      toDoModel
        .find({ status: status }, null, options)
        // .find()
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
              modified_at: utils.getCurrentDate(),
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

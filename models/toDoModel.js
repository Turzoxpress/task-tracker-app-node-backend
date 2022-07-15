const mongoose = require("mongoose");

const toDoListSchema = new mongoose.Schema({
  task_name: String,
  task_description: String,
  status: {
    type: String,
    enum: ["created", "working", "completed", "deleted"],
  },

  created_by: String,
  modified_by: String,

  created_at: Date,
  modified_at: Date,
});

module.exports = mongoose.model("toDoList", toDoListSchema);

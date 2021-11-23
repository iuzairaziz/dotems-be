const mongoose = require("mongoose");

const taskPriorityScheme = mongoose.Schema(
  {
    name: String,
    color: String,
    preset: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

const TaskPrioirty = mongoose.model("TaskPrioirty", taskPriorityScheme);

module.exports.TaskPrioirty = TaskPrioirty;

const mongoose = require("mongoose");

const workingShift = mongoose.Schema(
  {
    name: String,
    startTime: String,
    endTime: String,
    startBreakTime: String,
    endBreakTime: String,
  },
  { timestamps: true }
);

const WorkingShift = mongoose.model("WorkingShift", workingShift);

module.exports.WorkingShift = WorkingShift;

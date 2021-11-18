const mongoose = require("mongoose");

const workingHours = mongoose.Schema(
  {
    name: String,
    hours: Number,
  },
  { timestamps: true }
);

const WorkingHours = mongoose.model("WorkingHours", workingHours);

module.exports.WorkingHours = WorkingHours;

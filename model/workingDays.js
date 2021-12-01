const mongoose = require("mongoose");

const workingDays = mongoose.Schema(
  {
    name: String,

    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
    daysNumber: Number,
  },
  { timestamps: true }
);

const WorkingDays = mongoose.model("WorkingDays", workingDays);

module.exports.WorkingDays = WorkingDays;

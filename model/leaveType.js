const mongoose = require("mongoose");

const leaveTypeScheme = mongoose.Schema(
  {
    name: String,
    totalLeaves: Number,
  },
  { timestamps: true }
);

const LeaveType = mongoose.model("LeaveType", leaveTypeScheme);

module.exports.LeaveType = LeaveType;

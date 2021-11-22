const mongoose = require("mongoose");

const leavePolicyTimeeOffScheme = mongoose.Schema(
  {
    name: String,
    type: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType" },
    effectiveDate: Date,
    totalLeaves: Number,
    reset: String,
    maxPerMonthLeave: Number,
    DisAllowNegativeBalance: Boolean,
    sandwich: Boolean,
    noticePeriod: Number,
    sandwichType: String,
  },
  {
    timestamps: true,
  }
);

const LeavePolicyTimeOff = mongoose.model(
  "LeavePolicyTimeOff",
  leavePolicyTimeeOffScheme
);

module.exports.LeavePolicyTimeOff = LeavePolicyTimeOff;

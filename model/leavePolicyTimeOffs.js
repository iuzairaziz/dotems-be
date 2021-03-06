const mongoose = require("mongoose");

const leavePolicyTimeeOffScheme = mongoose.Schema(
  {
    leavePolicy: { type: mongoose.Schema.Types.ObjectId, ref: "LeavePolicy" },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType" },
    effectiveDate: String,
    totalLeaves: Number,
    // reset: String,
    maxPerMonthLeave: Number,
    disAllowNegativeBalance: Boolean,
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

const mongoose = require("mongoose");

const leavePolicyScheme = mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const LeavePolicy = mongoose.model("LeavePolicy", leavePolicyScheme);

module.exports.LeavePolicy = LeavePolicy;

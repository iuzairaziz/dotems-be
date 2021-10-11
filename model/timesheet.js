const mongoose = require("mongoose");

const timesheetSchema = mongoose.Schema(
  {
    date: Date,
    remarks: String,
    workedHrs: Number,
    approvedHrs: { type: Number, default: null },
    final: { type: Boolean, default: false },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Timesheet = mongoose.model("Timesheet", timesheetSchema);

module.exports.Timesheet = Timesheet;

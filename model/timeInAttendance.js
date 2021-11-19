const mongoose = require("mongoose");

const timeInAttendanceSchema = mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    time: String,
    date: String,
    latitude: Number,
    Longitude: Number,
  },
  {
    timestamps: true,
  }
);

const TimeInAttendance = mongoose.model(
  "TimeInAttendance",
  timeInAttendanceSchema
);

module.exports.TimeInAttendance = TimeInAttendance;

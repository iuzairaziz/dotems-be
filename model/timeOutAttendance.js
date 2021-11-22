const mongoose = require("mongoose");

const timeOutAttendanceSchema = mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    time: String,
    date: Date,
    latitude: Number,
    Longitude: Number,
  },
  {
    timestamps: true,
  }
);

const TimeOutAttendance = mongoose.model(
  "TimeOutAttendance",
  timeOutAttendanceSchema
);

module.exports.TimeOutAttendance = TimeOutAttendance;

const mongoose = require("mongoose");

const AttendanceSchema = mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timeIn: String,
    timeOut: String,
    date: String,
    latitude: Number,
    longitude: Number,
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports.Attendance = Attendance;

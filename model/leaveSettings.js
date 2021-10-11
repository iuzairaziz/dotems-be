const mongoose = require("mongoose");

const leaveSettingScheme = mongoose.Schema({
  // daysOf: Date,
  // sandwhich: {
  //   rules: {
  //     type: String,
  //     enum: ["before", "after", "between"],
  //     // default: "between",
  //   },
  // },
  sandwhich: String,
  noticeDays: Number,
  daysOff: [{ type: String }],
  // daysOff: {
  //   type: String,
  //   enum: [
  //     "monday",
  //     "tuesday",
  //     "wednesday",
  //     "thursday",
  //     "friday",
  //     "saturday",
  //     "sunday",
  //   ],
  //   default: "sunday",
  // },
});

const LeaveSetting = mongoose.model("LeaveSetting", leaveSettingScheme);

module.exports.LeaveSetting = LeaveSetting;

const mongoose = require("mongoose");

const leaveSettingScheme = mongoose.Schema({
  sandwhich: String,
  noticeDays: Number,
  daysOff: [{ type: String }],
  timesheetSave: String,
});

const LeaveSetting = mongoose.model("LeaveSetting", leaveSettingScheme);

module.exports.LeaveSetting = LeaveSetting;

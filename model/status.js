const mongoose = require("mongoose");

const statusScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Status = mongoose.model("Status", statusScheme);

module.exports.Status = Status;

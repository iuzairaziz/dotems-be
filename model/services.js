const mongoose = require("mongoose");

const serviceScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceScheme);

module.exports.Service = Service;

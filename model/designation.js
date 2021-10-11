const mongoose = require("mongoose");

const designationScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Designation = mongoose.model("Designation", designationScheme);

module.exports.Designation = Designation;

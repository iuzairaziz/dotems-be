const mongoose = require("mongoose");

const employeeTypeScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const EmployeeType = mongoose.model("EmployeeType", employeeTypeScheme);

module.exports.EmployeeType = EmployeeType;

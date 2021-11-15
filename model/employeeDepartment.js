const mongoose = require("mongoose");

const employeeDepartmentScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const EmployeeDepartment = mongoose.model(
  "EmployeeDepartment",
  employeeDepartmentScheme
);

module.exports.EmployeeDepartment = EmployeeDepartment;

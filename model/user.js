const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Project } = require("./project");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userRole: [{ type: String }],
    jobTitle: String,
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    employeeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeType",
    },
    employeeManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeDepartment",
    },
    employeeStatus: String,
    workingDays: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkingDays",
    },
    workingHours: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkingHours",
    },
    salary: Number,
    machineNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
    },
    resourceCost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceCost",
    },
    leavePolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeavePolicy",
    },
    technology: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    contactNo: Number,
    otherContactNo: Number,
    personalEmail: String,
    address: String,
    guardianName: String,
    guardianContact: String,
    status: String,
    gender: String,
    city: String,
    country: String,
    bankName: String,
    bankAccNo: String,
    joiningDate: Date,
    terminationDate: Date,
    dateOfBirth: Date,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    workingShift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkingShift",
    },
  },
  { timestamps: true }
);

// for generating hased passwords
userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

const User = mongoose.model("User", userSchema);
module.exports.User = User;

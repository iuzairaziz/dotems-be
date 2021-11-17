const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Project } = require("./project");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    gender: String,
    salary: Number,
    workingHrs: Number,
    password: String,
    status: String,
    joiningDate: String,
    contact: String,
    otherContact: String,
    emailPersonal: String,
    address: String,
    contactEmergency: String,
    nameEmergency: String,
    machineNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Machine",
    },
    employeeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeType",
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    workingDays: Number,
    userRole: [{ type: String }],
    image: String,
    technology: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    role: [
      {
        type: String,
        default: "User",
      },
    ],
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

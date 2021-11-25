const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: String,
    active: {
      type: Boolean,
      default: 1,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("role", roleSchema);

module.exports.Role = Role;

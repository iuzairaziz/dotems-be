const mongoose = require("mongoose");

const rolePermissionSchema = mongoose.Schema(
  {
    name: String,
    page: String,
    pageCategory: String,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    active: {
      type: Boolean,
      default: 1,
    },
  },
  { timestamps: true }
);

const RolePermission = mongoose.model("rolePermission", rolePermissionSchema);

module.exports.RolePermission = RolePermission;

const mongoose = require("mongoose");

const userProfileScheme = mongoose.Schema(
  {
    salary: String,
    machineNo: Number,
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", userProfileScheme);

module.exports.UserProfile = UserProfile;

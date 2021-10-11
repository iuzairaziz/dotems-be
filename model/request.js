const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestRecievers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestType",
    },
    description: String,
    adminRemark: { type: String, default: null },
    adminActionDate: { type: Date, default: null },
    adminStatus: {
      type: String,
      enum: ["Pending", "Resolved", "Not Resolved"],
      default: "Pending",
    },
    userStatus: {
      type: String,
      enum: ["Resolved", "Not Resolved"],
      default: "Not Resolved",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

module.exports.Request = Request;

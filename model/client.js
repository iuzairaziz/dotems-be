const mongoose = require("mongoose");

const clientScheme = mongoose.Schema(
  {
    name: String,
    companyName: String,
    address: String,
    mobileNo: Number,
    otherContact: Number,
    email: String,
    url: String,
    dateOfJoin: Date,
    country: String,
    clientType: String,
    status: String,
    socialContact: String,
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
    },
    clientLabel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientLabel",
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientScheme);

module.exports.Client = Client;

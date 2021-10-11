const mongoose = require("mongoose");

const clientScheme = mongoose.Schema(
  {
    name: String,
    companyName: String,
    address: String,
    mobileNo: Number,
    email: String,
    url: String,
    dateOfJoin: Date,
    country: String,
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientScheme);

module.exports.Client = Client;

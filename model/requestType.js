const mongoose = require("mongoose");

const requestTypeScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const RequestType = mongoose.model("RequestType", requestTypeScheme);

module.exports.RequestType = RequestType;

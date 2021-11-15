const mongoose = require("mongoose");

const clientLabelScheme = mongoose.Schema(
  {
    name: String,
    color: String,
    preset: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

const ClientLabel = mongoose.model("ClientLabel", clientLabelScheme);

module.exports.ClientLabel = ClientLabel;

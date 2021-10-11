const mongoose = require("mongoose");

const machineScheme = mongoose.Schema(
  {
    name: String,
    serialNo: String,
    machineNo: Number,
    Storage: String,
    Memory: String,
    Processor: String,
    Graphics: String,
    Ownership: String,
    Accessory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accessories",
      },
    ],
    Status: String,
    Notes: String,
  },
  { timestamps: true }
);

const Machine = mongoose.model("Machine", machineScheme);

module.exports.Machine = Machine;

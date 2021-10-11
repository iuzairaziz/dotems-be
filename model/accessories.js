const mongoose = require("mongoose");

const accessoriesScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Accessories = mongoose.model("Accessories", accessoriesScheme);

module.exports.Accessories = Accessories;

const mongoose = require("mongoose");

const technologySchema = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Technology = mongoose.model("Technology", technologySchema);

module.exports.Technology = Technology;

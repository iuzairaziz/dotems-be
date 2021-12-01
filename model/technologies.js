const mongoose = require("mongoose");

const technologySchema = mongoose.Schema(
  {
    name: String,
    preset: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

const Technology = mongoose.model("Technology", technologySchema);

module.exports.Technology = Technology;

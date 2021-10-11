const mongoose = require("mongoose");

const natureSchema = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Nature = mongoose.model("Nature", natureSchema);

module.exports.Nature = Nature;

const mongoose = require("mongoose");

const paltformScheme = mongoose.Schema(
  {
    name: String,
    preset: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

const Platform = mongoose.model("Platform", paltformScheme);

module.exports.Platform = Platform;

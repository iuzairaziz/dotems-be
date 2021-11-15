const mongoose = require("mongoose");

const paltformScheme = mongoose.Schema(
  {
    name: String,
    preset: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Platform = mongoose.model("Platform", paltformScheme);

module.exports.Platform = Platform;

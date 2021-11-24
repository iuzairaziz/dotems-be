const mongoose = require("mongoose");

const resourceCostScheme = mongoose.Schema(
  {
    name: String,
    cost: Number,
  },
  { timestamps: true }
);

const ResourceCost = mongoose.model("ResourceCost", resourceCostScheme);

module.exports.ResourceCost = ResourceCost;

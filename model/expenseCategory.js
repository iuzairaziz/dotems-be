const mongoose = require("mongoose");

const expenseCategoryScheme = mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const ExpenseCatgeory = mongoose.model(
  "ExpenseCatgeory",
  expenseCategoryScheme
);

module.exports.ExpenseCatgeory = ExpenseCatgeory;

const mongoose = require("mongoose");

const currencyScheme = mongoose.Schema(
  {
    name: String,
    exchangeRate: Number,
  },
  { timestamps: true }
);

const Currency = mongoose.model("Currency", currencyScheme);

module.exports.Currency = Currency;

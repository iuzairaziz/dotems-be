const mongoose = require("mongoose");

const paymentDetialsSchema = mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    paymentDetials: [
      {
        recievedAmount: Number,
        exchangeRate: Number,
        PaymentRecievedDate: Date,
        PaymentDescription: String,
        Tip: String,
      },
    ],
  },
  { timestamps: true }
);

const PaymentDetial = mongoose.model("PaymentDetial", paymentDetialsSchema);

module.exports.PaymentDetial = PaymentDetial;

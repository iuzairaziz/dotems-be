const mongoose = require("mongoose");

const historySchema = mongoose.Schema(
  {
    document: String,
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refpath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Machine"],
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

module.exports.History = History;

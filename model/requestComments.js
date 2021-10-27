const mongoose = require("mongoose");

const requestCommentSchema = mongoose.Schema(
  {
    data: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: null,
    },
  },
  { timestamps: true }
);

const RequestComment = mongoose.model("RequestComment", requestCommentSchema);

module.exports.RequestComment = RequestComment;

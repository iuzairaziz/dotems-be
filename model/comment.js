const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    data: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports.Comment = Comment;

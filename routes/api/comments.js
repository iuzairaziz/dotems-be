var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
const mongoose = require("mongoose");
var router = express.Router();
const { Comment } = require("../../model/comment");
const moment = require("moment");
const auth = require("../../middlewares/auth");

/* Get Tasks */
router.get("/:taskId", auth, async (req, res) => {
  const taskId = req.params.taskId;
  console.log("task ID", taskId);
  let comments = await Comment.find({ task: taskId })
    .populate("task")
    .populate("user");
  return res.send(comments);
});

/*Add new task*/
router.post("/", auth, async (req, res) => {
  console.log(req.body);
  const comment = new Comment(req.body);
  comment
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// get comments in project
router.get("/project/:projectId", auth, async (req, res) => {
  const projectId = req.params.projectId;
  console.log("project ID", projectId);
  let comments = await Comment.find({ project: projectId })
    .populate("project")
    .populate("user");
  return res.send(comments);
});

router.post("/projects", auth, async (req, res) => {
  console.log(req.body);
  const comment = new Comment(req.body);
  comment
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Tasks
// router.put("/:id", auth, async (req, res) => {
//   try {
//     let task = await Tasks.findById(req.params.id);
//     console.log(task);
//     if (!task) return res.status(400).send("Task with given id is not present");
//     task = extend(task, req.body);
//     await task.save();
//     return res.send(task);
//   } catch {
//     return res.status(400).send("Invalid Id"); // when id is inavlid
//   }
// });

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
const mongoose = require("mongoose");
var router = express.Router();
const { Tasks } = require("../../model/task");
const moment = require("moment");
const auth = require("../../middlewares/auth");

/* Get Tasks */
router.get("/show-task", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let tasks = await Tasks.find()
    .populate("projects")
    .populate("parentTask")
    .populate("project")
    .populate("teamLead")
    .populate("addedby", "name")
    .populate("addedBy")
    .populate("assignedTo")
    .populate("phase", "phasename")
    .populate("taskPriority")
    .sort({
      createdAt: -1,
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(tasks);
});

/*Add new task*/
router.post("/create-task", auth, async (req, res) => {
  let tasks = await Tasks.findOne({ name: req.body.name });
  if (tasks) return res.status(400).send("Task With Given Name Already Exists");
  task = new Tasks(req.body);
  task
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Tasks
router.put("/:id", auth, async (req, res) => {
  try {
    let task = await (await Tasks.findById(req.params.id))
      .populate("phase", "phasename")
      .populate("taskPriority");
    // console.log(task);
    if (!task) return res.status(400).send("Task with given id is not present");
    task = extend(task, req.body);
    await task.save();
    return res.send(task);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    let task = await Tasks.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(400).send("Task with given id is not present"); // when there is no id in db
    }
    return res.send(task); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

router.get("/project-tasks/:id", auth, async (req, res) => {
  let tasks = await Tasks.find({ project: req.params.id })
    .populate("projects")
    .populate("parentTask")
    .populate("project")
    .populate("teamLead")
    .populate("addedBy", "name")
    .populate("approvedBy")
    .populate("assignedTo")
    .populate("phase")
    .sort({
      createdAt: -1,
    });

  return res.send(tasks);
});

router.get("/parents", auth, async (req, res) => {
  let tasks = await Tasks.aggregate([
    { $match: { parentTask: null } },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    // { $unwind: { path: "$taskPriority", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "TaskPrioirty",
        localField: "taskPriority",
        foreignField: "_id",
        as: "taskPriority",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(tasks);
});

router.get("/:id", auth, async (req, res) => {
  console.log(req.params.id);
  let task = await Tasks.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "tasks",
        localField: "parentTask",
        foreignField: "_id",
        as: "parentTask",
      },
    },
    { $unwind: { path: "$parentTask", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$task", "$$taskId"] },
                  { $ne: ["$remarks", null] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "employee",
              foreignField: "_id",
              as: "employee",
            },
          },
          { $unwind: { path: "$employee", preserveNullAndEmptyArrays: true } },
          { $project: { _id: 0, remarks: 1, date: 1, employee: 1 } },
        ],
        as: "taskRemarks",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  let subTasks = await Tasks.find({ parentTask: task[0]._id })
    .populate("projects")
    .populate("parentTask")
    .populate("project")
    .populate("teamLead")
    .populate("addedBy", "name")
    .populate("approvedBy")
    .populate("assignedTo")
    .populate("phase")
    .sort({
      createdAt: -1,
    });

  return res.send({ task: task[0], subTasks });
});

router.get("/by-employee/:empId", auth, async (req, res) => {
  console.log(req.params.empId);

  let task = await Tasks.aggregate([
    { $match: { assignedTo: mongoose.Types.ObjectId(req.params.empId) } },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(task);
});

router.get("/by-employee-late/:empId", auth, async (req, res) => {
  const today = moment().toDate();
  // const from_date = today.toDate();
  console.log("today", today);
  console.log(req.params.empId);

  let task = await Tasks.aggregate([
    {
      $match: {
        assignedTo: mongoose.Types.ObjectId(req.params.empId),
        endTime: { $lte: today },
        status: { $ne: "completed" },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(task);
});

router.get("/by-employee-weekly/:empId", auth, async (req, res) => {
  const today = moment();
  const from_date = today.startOf("week").toDate();
  const to_date = today.endOf("week").toDate();
  console.log("week", to_date);
  console.log(req.params.empId);

  let task = await Tasks.aggregate([
    {
      $match: {
        assignedTo: mongoose.Types.ObjectId(req.params.empId),
        endTime: { $lte: to_date, $gte: from_date },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(task);
});

router.get("/by-employee-next-week/:empId", auth, async (req, res) => {
  const today = moment();
  const from_date = today.startOf("week").add(1, "Week").toDate();
  const to_date = today.endOf("week").add(1, "Week").toDate();
  console.log("week", to_date);
  console.log(req.params.empId);

  let task = await Tasks.aggregate([
    {
      $match: {
        assignedTo: mongoose.Types.ObjectId(req.params.empId),
        endTime: { $lte: to_date, $gte: from_date },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(task);
});

router.get("/by-employee-next-month/:empId", auth, async (req, res) => {
  const today = moment();
  const from_date = today.startOf("week").add(1, "Month").toDate();
  const to_date = today.endOf("week").add(1, "Month").toDate();
  console.log("week", to_date);
  console.log(req.params.empId);

  let task = await Tasks.aggregate([
    {
      $match: {
        assignedTo: mongoose.Types.ObjectId(req.params.empId),
        endTime: { $lte: to_date, $gte: from_date },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "addedBy",
        foreignField: "_id",
        as: "addedBy",
      },
    },
    { $unwind: { path: "$addedBy", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "teamLead",
        foreignField: "_id",
        as: "teamLead",
      },
    },
    { $unwind: { path: "$teamLead", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "timesheets",
        let: { taskId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$task", "$$taskId"] } } },
          { $group: { _id: null, actualHrs: { $sum: "$workedHrs" } } },
          { $project: { _id: 0 } },
        ],
        as: "timesheet",
      },
    },
    { $unwind: { path: "$timesheet", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ]);

  return res.send(task);
});

router.post("/by-employee-project", auth, async (req, res) => {
  let { empId, projectId } = req.body;
  console.log("body", req.body);
  try {
    let tasks = await Tasks.find({
      project: projectId,
      assignedTo: { _id: empId },
    }).populate("assignedTo");
    if (!tasks) {
      return res.status(404).send("Task with given id is not present"); // when there is no id in db
    }
    return res.send(tasks); // when everything is okay
  } catch (err) {
    console.log("error", err.message);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

router.post("/employee", auth, async (req, res) => {
  let empId = req.body.empId;
  let startDate = moment(req.body.startDate).toDate();
  let endDate = moment(req.body.endDate).toDate();

  console.log("empId==", empId);
  console.log("start==", startDate);
  console.log("end==", endDate);
  try {
    let result = await Tasks.aggregate([
      {
        $project: {
          name: 1,
          project: 1,
          assignedTo: 1,
          workDone: 1,
          createdAt: 1,
        },
      },
      {
        $match: {
          assignedTo: mongoose.Types.ObjectId(empId),
          createdAt: { $lte: endDate },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "timesheets",
          let: { taskId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$taskId", "$task"] },
                    { $eq: [mongoose.Types.ObjectId(empId), "$employee"] },
                    { $gte: ["$date", startDate] },
                    { $lte: ["$date", endDate] },
                  ],
                },
              },
            },
            { $sort: { date: 1 } },
          ],
          as: "timesheet",
        },
      },
      { $group: { _id: "$project", tasks: { $push: "$$ROOT" } } },

      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $project: {
          tasks: 1,
          project: { $arrayElemAt: ["$project", 0] },
          _id: 0,
        },
      },
      { $sort: { "project.createdAt": -1 } },
      // {$replaceRoot:{"newRoot":"$project"}}
    ]);
    if (!result) {
      return res.status(404).send("Task with given employee id is not present"); // when there is no id in db
    }
    res.send(result);
  } catch (err) {
    console.log("error", err.message);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }

  // let result = await Tasks.find({assignedTo:{_id:empId}});
  // console.log("resulttt",result)
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Timesheet } = require("../../model/timesheet");
const { Project } = require("../../model/project");
const moment = require("moment");
const { Tasks } = require("../../model/task");
const auth = require("../../middlewares/auth");

/* Get Timesheet */
router.get("/", auth, async (req, res) => {
  let timesheet = await Timesheet.find()
    .populate("employee")
    .populate("task")
    .populate("approvedBy");
  return res.send(timesheet);
});

/*Add new timesheet*/
router.post("/", auth, async (req, res) => {
  let timesheet = await Timesheet.findOne({
    date: req.body.date,
    employee: req.body.employee,
    task: req.body.task,
  });
  if (timesheet)
    return res
      .status(400)
      .send("Timesheet With this Date and Task Already Exists");
  timesheet = new Timesheet(req.body);
  timesheet
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

router.post("/weekly", auth, async (req, res) => {
  try {
    const data = req.body.employeeData;
    const empId = req.body.empId;
    const days = req.body.days;
    const final = req.body.final;
    console.log("body", req.body);
    // console.log("asddasda",moment(body["task1day1date"]).format("YYYY-MM-DD"));
    let records = [];
    // let noOfRecords = body.counter;
    var i, j;
    let taskRecords = [];
    data.map((project) => {
      project.tasks.map((task) => {
        if (task.workDone) {
          taskRecords.push({
            workDone: task.workDone,
            _id: task._id,
          });
        }
        [0, 1, 2, 3, 4, 5, 6].map((item) => {
          records.push({
            employee: empId,
            task: task._id,
            date: moment(days[item]).format("YYYY-MM-DD"),
            workedHrs: task.timesheet[item] && task.timesheet[item].workedHrs,
            remarks: task.timesheet[item] && task.timesheet[item].remarks,
            approvedBy: null,
            status: "pending",
            final: final,
          });
        });
        // task.timesheet.map(ts=>{
        //   if(ts!=null){
        //     records.push({
        //       employee:empId,
        //       task:task._id,
        //       date:moment(ts.date).format("YYYY-MM-DD"),
        //       workedHrs:ts.workedHrs?ts.workedHrs:null,
        //       remarks:ts.remarks?ts.remarks:"",
        //       approvedBy:null,
        //       day:ts.day,
        //       status:"pending",
        //     })
        //   }
        // })
      });
    });

    // for (i = 1; i <= noOfRecords; i++) {
    //   for(j=0;j<7;j++){
    //     records.push({
    //       employee:body.empId,
    //       task:body[`task${i}taskId`],
    //       date:moment(body[`task${i}day${j}date`]).format("YYYY-MM-DD"),
    //       workedHrs:body[`task${i}day${j}hrs`],
    //       approvedBy:null,
    //       status:"pending",
    //     })
    //   }
    // }

    let result = await Timesheet.bulkWrite(
      records.map((r) => {
        return {
          updateOne: {
            filter: { date: r.date, employee: empId, task: r.task },
            update: { $set: r },
            upsert: true,
          },
        };
      }),
      { ordered: false }
    );

    let taskResult = await Tasks.bulkWrite(
      taskRecords.map((r) => {
        return {
          updateOne: {
            filter: { _id: r._id },
            update: { $set: { workDone: r.workDone } },
          },
        };
      })
    );

    res.send({ result, taskResult });
  } catch (error) {
    console.log("error is", error);
    res.status(500).send({ error });
  }

  // console.log("recrds",records);
});

// Daily Timesheet
router.post("/daily", auth, async (req, res) => {
  try {
    const data = req.body.employeeData;
    const empId = req.body.empId;
    const day = req.body.days;
    const final = req.body.final;
    console.log("body", req.body);
    let records = [];
    var i, j;
    let taskRecords = [];
    data.map((project) => {
      project.tasks.map((task) => {
        if (task.workDone) {
          taskRecords.push({
            workDone: task.workDone,
            _id: task._id,
          });
        }
        // [0, 1, 2, 3, 4, 5, 6].map((item) => {
          records.push({
            employee: empId,
            task: task._id,
            date: moment(day).format("YYYY-MM-DD"),
            workedHrs: task.timesheet[0] && task.timesheet[0].workedHrs,
            remarks: task.timesheet[0] && task.timesheet[0].remarks,
            approvedBy: null,
            status: "pending",
            final: final,
          });
        // });
      });
    });
    let result = await Timesheet.bulkWrite(
      records.map((r) => {
        return {
          updateOne: {
            filter: { date: r.date, employee: empId, task: r.task },
            update: { $set: r },
            upsert: true,
          },
        };
      }),
      { ordered: false }
    );
    let taskResult = await Tasks.bulkWrite(
      taskRecords.map((r) => {
        return {
          updateOne: {
            filter: { _id: r._id },
            update: { $set: { workDone: r.workDone } },
          },
        };
      })
    );
    res.send({ result, taskResult });
  } catch (error) {
    console.log("error is", error);
    res.status(500).send({ error });
  }
});

// Update Timesheet
router.put("/:id", auth, async (req, res) => {
  try {
    let timesheet = await Timesheet.findById(req.params.id);
    console.log(timesheet);
    if (!timesheet)
      return res.status(400).send("Task with given id is not present");
    timesheet = extend(timesheet, req.body);
    await timesheet.save();
    return res.send(timesheet);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    let timesheet = await Timesheet.findByIdAndDelete(req.params.id);
    if (!timesheet) {
      return res.status(400).send("Task with given id is not present"); // when there is no id in db
    }
    return res.send(timesheet); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

router.get("/project-timesheet/:id", async (req, res) => {
  let timesheet = await Timesheet.find({ project: req.params.id })
    .populate("projects")
    .populate("parentTask")
    .populate("project")
    .populate("teamLead")
    .populate("addedby", "name")
    .populate("approvedBy")
    .populate("assignedTo");

  return res.send(timesheet);
});

module.exports = router;

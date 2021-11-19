var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { LeavePolicy } = require("../../model/leavePolicy");
const auth = require("../../middlewares/auth");
const { TimeInAttendance } = require("../../model/timeInAttendance");

// /* Get All Designations And Users */
// router.get("/show-working-hours", auth, async (req, res) => {
//   let page = Number(req.query.page ? req.query.page : 1);
//   let perPage = Number(req.query.perPage ? req.query.perPage : 10);
//   let skipRecords = perPage * (page - 1);
//   let workingHours = await WorkingHours.find().skip(skipRecords).limit(perPage);
//   return res.send(workingHours);
// });

// Get Single
router.get("/:id", auth, async (req, res) => {
  let timeIn;
  try {
    timeIn = await TimeInAttendance.findById(req.params.id);
    if (!timeIn)
      return res.status(400).send("Attendance with given id is not present");
    else {
      return res.send(timeIn);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/create-time-in", auth, async (req, res) => {
  let timeInAttendance = await TimeInAttendance.findOne({
    date: req.body.date,
    name: req.body.name,
  });
  if (timeInAttendance)
    return res.status(400).send("You Already Mark your Attendance");
  timeInAttendance = new TimeInAttendance(req.body);
  timeInAttendance
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// //Update
// router.put("/:id", auth, async (req, res) => {
//   try {
//     let workingHours = await WorkingHours.findById(req.params.id);
//     console.log(workingHours);
//     if (!workingHours)
//       return res.status(400).send("Working Hours with given id is not present");
//     workingHours = extend(workingHours, req.body);
//     await workingHours.save();
//     return res.send(workingHours);
//   } catch {
//     return res.status(400).send("Invalid Id"); // when id is inavlid
//   }
// });

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let timeIn = await TimeInAttendance.findByIdAndDelete(req.params.id);
    if (!timeIn) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(timeIn); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

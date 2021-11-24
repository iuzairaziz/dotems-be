var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { Attendance } = require("../../model/Attendance");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/:id", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let allAttendanceTime = await Attendance.find({ name: req.params.id })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(allAttendanceTime);
});

// //Get Single
// router.get("/:id", auth, async (req, res) => {
//   let workingHour;
//   try {
//     workingHour = await WorkingHours.findById(req.params.id);
//     if (!workingHour)
//       return res.status(400).send("Working Hours with given id is not present");
//     else {
//       return res.send(workingHour);
//     }
//   } catch {
//     return res.status(400).send("Invalid Id"); // when id is inavlid
//   }
// });

/*Add new Designation*/
router.post("/create-time-in", auth, async (req, res) => {
  let timeIn = await Attendance.findOne({
    name: req.body.name,
    date: req.body.date,
  });

  // if (timeIn)
  //   return res.status(400).send("Your Already Marked your Attendance");
  timeIn = new Attendance(req.body);
  timeIn
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });

  // let timeOutAgain = await TimeOutAttendance.findOne({
  //   name: req.body.name,
  //   date: req.body.date,
  // });

  // if (timeOutAgain) {
  //   let totalTime = new TotalTimeAttendance({
  //     timeIn: timeIn._id,
  //     timeOut: timeOutAgain._id,
  //   });
  //   totalTime
  //     .save()
  //     .then((resp) => {
  //       return res.send(resp);
  //     })
  //     .catch((err) => {
  //       return res.status(500).send({ error: err });
  //     });
  // }
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

router.put("/update", auth, async (req, res) => {
  try {
    let timeIn = await Attendance.find({
      name: req.body.name,
    });

    let oldTime = timeIn[timeIn.length - 1];
    if (oldTime.timeOut)
      return res
        .status(400)
        .send("You have Not marked your time In Attendance");
    if (!oldTime.timeOut) {
      oldTime = extend(oldTime, req.body);
      await oldTime.save();
      return res.send(oldTime);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// // Delete Designation
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     let workingHours = await WorkingHours.findByIdAndDelete(req.params.id);
//     if (!workingHours) {
//       return res
//         .status(400)
//         .send("Working days policy with given id is not present"); // when there is no id in db
//     }
//     return res.send(workingHours); // when everything is okay
//   } catch {
//     return res.status(400).send("Invalid Id"); // when id is inavlid
//   }
// });

module.exports = router;

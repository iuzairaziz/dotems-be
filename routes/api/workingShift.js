var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { WorkingShift } = require("../../model/workingShift");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-working-shift", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let workingShift = await WorkingShift.find().skip(skipRecords).limit(perPage);
  return res.send(workingShift);
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let workingShift;
  try {
    workingShift = await WorkingShift.findById(req.params.id);
    if (!workingShift)
      return res.status(400).send("Working Hours with given id is not present");
    else {
      return res.send(workingShift);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/create-working-shift", auth, async (req, res) => {
  let workingShift = await WorkingShift.findOne({
    name: req.body.name,
  });
  if (workingShift)
    return res.status(400).send("Policy With Given Name Already Exsists");
  workingShift = new WorkingShift(req.body);
  workingShift
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

//Update
router.put("/:id", auth, async (req, res) => {
  try {
    let workingShift = await WorkingShift.findById(req.params.id);
    console.log(workingShift);
    if (!workingShift)
      return res.status(400).send("Working Shift with given id is not present");
    workingShift = extend(workingShift, req.body);
    await workingShift.save();
    return res.send(workingShift);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let workingShift = await WorkingShift.findByIdAndDelete(req.params.id);
    if (!workingShift) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(workingShift); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

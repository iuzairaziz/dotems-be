var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { WorkingHours } = require("../../model/workingHours");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-working-hours", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let workingHours = await WorkingHours.find().skip(skipRecords).limit(perPage);
  return res.send(workingHours);
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let workingHour;
  try {
    workingHour = await WorkingHours.findById(req.params.id);
    if (!workingHour)
      return res.status(400).send("Working Hours with given id is not present");
    else {
      return res.send(workingHour);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/create-working-hours", auth, async (req, res) => {
  let workingHours = await WorkingHours.findOne({
    name: req.body.name,
  });
  if (workingHours)
    return res.status(400).send("Policy With Given Name Already Exsists");
  workingHours = new WorkingHours(req.body);
  workingHours
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
    let workingHours = await WorkingHours.findById(req.params.id);
    console.log(workingHours);
    if (!workingHours)
      return res.status(400).send("Working Hours with given id is not present");
    workingHours = extend(workingHours, req.body);
    await workingHours.save();
    return res.send(workingHours);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let workingHours = await WorkingHours.findByIdAndDelete(req.params.id);
    if (!workingHours) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(workingHours); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

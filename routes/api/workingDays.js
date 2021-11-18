var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { WorkingDays } = require("../../model/workingDays");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-working-days", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let workingDays = await WorkingDays.find().skip(skipRecords).limit(perPage);
  return res.send(workingDays);
});
//Get Single
router.get("/:id", auth, async (req, res) => {
  let workingDay;
  try {
    workingDay = await WorkingDays.findById(req.params.id);
    if (!workingDay)
      return res.status(400).send("Working Day with given id is not present");
    else {
      return res.send(workingDay);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/create-working-days", auth, async (req, res) => {
  let workingDays = await WorkingDays.findOne({
    name: req.body.name,
  });
  if (workingDays)
    return res.status(400).send("Policy With Given Name Already Exsists");
  workingDays = new WorkingDays(req.body);
  workingDays
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
    let workingDay = await WorkingDays.findById(req.params.id);
    console.log(workingDay);
    if (!workingDay)
      return res.status(400).send("Working Day with given id is not present");
    workingDay = extend(workingDay, req.body);
    await workingDay.save();
    return res.send(workingDay);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let workingDays = await WorkingDays.findByIdAndDelete(req.params.id);
    if (!workingDays) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(workingDays); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

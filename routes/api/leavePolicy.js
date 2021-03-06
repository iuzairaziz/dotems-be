var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { LeavePolicy } = require("../../model/leavePolicy");
const auth = require("../../middlewares/auth");
const { LeavePolicyTimeOff } = require("../../model/leavePolicyTimeOffs");

// /* Get All Designations And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let leavePolicies = await LeavePolicy.find().skip(skipRecords).limit(perPage);
  return res.send(leavePolicies);
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let leavePolicy;
  try {
    leavePolicy = await LeavePolicy.findById(req.params.id);
    if (!leavePolicy)
      return res.status(400).send("Leave Policy with given id is not present");
    else {
      return res.send(leavePolicy);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/", auth, async (req, res) => {
  let leavePolicy = await LeavePolicy.findOne({
    name: req.body.name,
  });
  if (leavePolicy)
    return res.status(400).send("Policy With Given Name Already Exsists");
  leavePolicy = new LeavePolicy(req.body);
  leavePolicy
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
    let leavePolicy = await LeavePolicy.findById(req.params.id);
    console.log(leavePolicy);
    if (!leavePolicy)
      return res.status(400).send("Working Hours with given id is not present");
    leavePolicy = extend(leavePolicy, req.body);
    await leavePolicy.save();
    return res.send(leavePolicy);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let leavePolicy = await LeavePolicy.findByIdAndDelete(req.params.id);
    if (!leavePolicy) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(leavePolicy); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

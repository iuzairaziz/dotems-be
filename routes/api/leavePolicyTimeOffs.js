var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { LeavePolicyTimeOff } = require("../../model/leavePolicyTimeOffs");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-leave-policy", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let leavePolicy = await LeavePolicyTimeOff.find()
    .skip(skipRecords)
    .limit(perPage);
  return res.send(leavePolicy);
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let leavePolicy;
  try {
    leavePolicy = await LeavePolicyTimeOff.findById(req.params.id);
    if (!leavePolicy)
      return res.status(400).send("Working Hours with given id is not present");
    else {
      return res.send(leavePolicy);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/", auth, async (req, res) => {
  let leavePolicyTimeOffs = await LeavePolicyTimeOff.findOne({
    name: req.body.name,
    type: req.body.type,
  });
  console.log(req.body);

  if (leavePolicyTimeOffs)
    return res.status(400).send("Policy With Given Name Already Exsists");
  // leavePolicyTimeOffs = new LeavePolicyTimeOff(req.body);
  LeavePolicyTimeOff.insertMany(req.body)
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
    let leavePolicy = await LeavePolicyTimeOff.findById(req.params.id);
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
    let leavePolicyTimeOff = await LeavePolicyTimeOff.findByIdAndDelete(
      req.params.id
    );
    if (!leavePolicyTimeOff) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(leavePolicyTimeOff); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

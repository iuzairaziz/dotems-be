var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { LeavePolicyTimeOff } = require("../../model/leavePolicyTimeOffs");
const auth = require("../../middlewares/auth");
const mongoose = require("mongoose");
const { LeavePolicy } = require("../../model/leavePolicy");

/* Get All Designations And Users */
router.get("/", auth, async (req, res) => {
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
    leavePolicy = await LeavePolicyTimeOff.find({
      leavePolicy: req.params.id,
    }).populate("type");
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
  // let leavePolicy = await LeavePolicy.find({
  //   name: mongoose.Types.ObjectId(req.body.name),
  //   type: mongoose.Types.ObjectId(req.body.type),
  // });
  // console.log(req.body);
  // console.log(leavePolicy);
  // if (leavePolicy.length > 0)
  //   return res.status(400).send("Policy With Given Name Already Exsists");
  // leavePolicyTimeOffs = new LeavePolicyTimeOff(req.body);
  // LeavePolicyTimeOff.updateMany({    name: mongoose.Types.ObjectId(req.body.name),
  // type: mongoose.Types.ObjectId(req.body.type),},req.body,{upsert=true})
  LeavePolicyTimeOff.bulkWrite(
    req.body.map((item) => ({
      updateOne: {
        filter: { leavePolicy: item.leavePolicy, type: item.type },
        update: { $set: item },
        upsert: true,
      },
    }))
  )
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
    let leavePolicyTimeOff = await LeavePolicyTimeOff.deleteMany({
      leavePolicy: req.params.id,
    });
    let leavePolicy = await LeavePolicy.findByIdAndDelete(req.params.id);

    if (!leavePolicyTimeOff) {
      return res.status(400).send("Leave policy with given id is not present"); // when there is no id in db
    }
    return res.send(leavePolicyTimeOff); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

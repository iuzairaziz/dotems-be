var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { LeavePolicyTimeOff } = require("../../model/leavePolicyTimeOffs");
const auth = require("../../middlewares/auth");
const mongoose = require("mongoose");
const { LeaveType } = require("../../model/leaveType");

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
router.get("/policies/:id", auth, async (req, res) => {
  let leavePolicy;
  try {
    console.log(typeof req.params.id);
    let leavePolices = await LeaveType.aggregate([
      {
        $lookup: {
          from: "leavepolicytimeoffs",
          let: { leaveType_Id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type", "$$leaveType_Id"] },
                    {
                      $eq: [
                        "$leavePolicy",
                        mongoose.Types.ObjectId(req.params.id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "policy",
        },
      },
    ]);

    return res.send(leavePolices);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let leavePolicy;
  try {
    leavePolicy = await LeavePolicyTimeOff.find({
      leavePolicy: req.params.id,
    })
      .populate("type")
      .populate("leavePolicy");
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
router.put("/update", auth, async (req, res) => {
  // try {
  console.log("edit req", req.body);
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
  //   let leavePolicy = await LeavePolicyTimeOff.findById(req.params.id);
  //   console.log(leavePolicy);
  //   if (!leavePolicy)
  //     return res.status(400).send("Working Hours with given id is not present");
  //   leavePolicy = extend(leavePolicy, req.body);
  //   await leavePolicy.save();
  //   return res.send(leavePolicy);
  // } catch {
  //   return res.status(400).send("Invalid Id"); // when id is inavlid
  // }
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
      leavePolicy: mongoose.Types.ObjectId(req.params.id),
    });
    if (!leavePolicyTimeOff) {
      return res.status(400).send("Leave policy with given id is not present"); // when there is no id in db
    }
    return res.send(leavePolicyTimeOff); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

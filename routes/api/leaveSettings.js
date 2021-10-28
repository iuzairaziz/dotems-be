var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { LeaveSetting } = require("../../model/leaveSettings");
const { Leave } = require("../../model/leave");
const auth = require("../../middlewares/auth");

// Add Leave Settings
router.post("/settings", auth, async (req, res) => {
  let leaveSetting = await LeaveSetting.findOne({
    sandwhich: req.body.sandwhich,
  });
  if (leaveSetting.length === 1) {
    leaveSetting = extend(leaveSetting[0], req.body);
    await leaveSetting
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
  }
  // if (leaveSetting) return res.status(400).send("Leave Setting not updated"); 
  else {leaveSetting = new LeaveSetting(req.body);
    await leaveSetting
      .save()
      .then((resp) => {
        return res.send(resp);
      })
      .catch((err) => {
        return res.status(500).send({ error: err });
      })} 
});

// Get Leave Settings
router.get("/setting", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let leaveSetting = await LeaveSetting.find()
    // .populate("daysOff")
    .skip(skipRecords)
    .limit(perPage);
  return res.send(leaveSetting);
});

// Update Leave Settings
router.put("/:id", auth, async (req, res) => {
  try {
    let leaveSetting = await LeaveSetting.findById(req.params.id);
    console.log(leaveSetting);
    if (!leaveSetting)
      return res.status(400).send("leaveSetting with given id is not present");
    leaveSetting = extend(leaveSetting, req.body);
    await leaveSetting.save();
    return res.send(leaveSetting);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

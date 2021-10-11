var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { LeaveSetting } = require("../../model/leaveSettings");
const { Leave } = require("../../model/leave");
const auth = require("../../middlewares/auth");

router.post("/settings", auth, async (req, res) => {
  let leaveSetting = await LeaveSetting.findOne({
    sandwhich: req.body.sandwhich,
  });
  if (leaveSetting) return res.status(400).send("Leave Setting not updated");
  leaveSetting = new LeaveSetting(req.body);
  leaveSetting
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

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

module.exports = router;

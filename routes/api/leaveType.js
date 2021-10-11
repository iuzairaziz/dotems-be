var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { LeaveType } = require("../../model/leaveType");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-leave-type", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let leaveType = await LeaveType.find()
    .sort({
      createdAt: -1,
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(leaveType);
});

/*Add new Designation*/
router.post("/create-leave-type", auth, async (req, res) => {
  let leaveType = await LeaveType.findOne({
    name: req.body.name,
  });
  if (leaveType) return res.status(404).send("Leave Type Already Exsists");
  leaveType = new LeaveType(req.body);
  leaveType
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Designation
router.put("/:id", auth, async (req, res) => {
  try {
    let leaveType = await LeaveType.findById(req.params.id);
    console.log(leaveType);
    if (!leaveType)
      return res.status(400).send("client with given id is not present");
    leaveType = extend(leaveType, req.body);
    await leaveType.save();
    return res.send(leaveType);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let leaveType = await LeaveType.findByIdAndDelete(req.params.id);
    if (!leaveType) {
      return res.status(400).send("client with given id is not present"); // when there is no id in db
    }
    return res.send(leaveType); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

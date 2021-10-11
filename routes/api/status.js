var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Status } = require("../../model/status");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-status", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let status = await Status.find().skip(skipRecords).limit(perPage);
  return res.send(status);
});

/*Add new Designation*/
router.post("/create-status", auth, async (req, res) => {
  let status = await Status.findOne({
    name: req.body.name,
  });
  if (status)
    return res.status(400).send("Status With Given Name Already Exsists");
  status = new Status(req.body);
  status
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
    let status = await Status.findById(req.params.id);
    console.log(status);
    if (!status)
      return res.status(400).send("Status with given id is not present");
    status = extend(status, req.body);
    await status.save();
    return res.send(status);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let status = await Status.findByIdAndDelete(req.params.id);
    if (!status) {
      return res.status(400).send("Status with given id is not present"); // when there is no id in db
    }
    return res.send(status); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Status Id"); // when id is inavlid
  }
});

module.exports = router;

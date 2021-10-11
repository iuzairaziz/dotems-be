var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Platform } = require("../../model/platform");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-platform", auth, async (req, res) => {
  // let page = Number(req.query.page ? req.query.page : 1);
  // let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  // let skipRecords = perPage * (page - 1);
  let platform = await Platform.find();
  return res.send(platform);
});

/*Add new Designation*/
router.post("/create-platform", auth, async (req, res) => {
  let platform = await Platform.findOne({
    name: req.body.name,
  });
  if (platform)
    return res.status(400).send("Platform With Given Name Already Exsists");
  platform = new Platform(req.body);
  platform
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
    let platform = await Platform.findById(req.params.id);
    console.log(platform);
    if (!platform)
      return res.status(400).send("Platform with given id is not present");
    platform = extend(platform, req.body);
    await platform.save();
    return res.send(platform);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let platform = await Platform.findByIdAndDelete(req.params.id);
    if (!platform) {
      return res.status(400).send("Platform with given id is not present"); // when there is no id in db
    }
    return res.send(platform); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Platform Id"); // when id is inavlid
  }
});

module.exports = router;

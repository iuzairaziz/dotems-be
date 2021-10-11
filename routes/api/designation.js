var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Designation } = require("../../model/designation");

/* Get All Designations And Users */
router.get("/show-designation", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let designation = await Designation.find().skip(skipRecords).limit(perPage);
  return res.send(designation);
});

/*Add new Designation*/
router.post("/create-designation", auth, async (req, res) => {
  let designation = await Designation.findOne({
    name: req.body.name,
  });
  if (designation)
    return res.status(400).send("Country With Given Name Already Exsists");
  designation = new Designation(req.body);
  designation
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
    let designation = await Designation.findById(req.params.id);
    console.log(designation);
    if (!designation)
      return res.status(400).send("Country with given id is not present");
    // country = extend(country, req.body);
    designation.name = req.body.name;
    await designation.save();
    return res.send(designation);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) {
      return res.status(400).send("Country with given id is not present"); // when there is no id in db
    }
    return res.send(designation); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

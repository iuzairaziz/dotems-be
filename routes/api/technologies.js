var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Technology } = require("../../model/technologies");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-technologies", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let technology = await Technology.find().skip(skipRecords).limit(perPage);
  return res.send(technology);
});

/*Add new Designation*/
router.post("/create-technologies", auth, async (req, res) => {
  let technology = await Technology.findOne({
    name: req.body.name,
  });
  if (technology)
    return res.status(400).send("Technology With Given Name Already Exsists");
  technology = new Technology(req.body);
  technology
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
    let technology = await Technology.findById(req.params.id);
    console.log(technology);
    if (!technology)
      return res.status(400).send("Technology with given id is not present");
    technology = extend(technology, req.body);
    await technology.save();
    return res.send(technology);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let technology = await Technology.findByIdAndDelete(req.params.id);
    if (!technology) {
      return res.status(400).send("Technology with given id is not present"); // when there is no id in db
    }
    return res.send(technology); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Technology Id"); // when id is inavlid
  }
});

module.exports = router;

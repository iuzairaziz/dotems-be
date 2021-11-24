var express = require("express");
const { extend } = require("lodash");
var router = express.Router();
const { ResourceCost } = require("../../model/resourceCost");
const auth = require("../../middlewares/auth");

/* Get All Resource Cost */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let resourceCost = await ResourceCost.find().skip(skipRecords).limit(perPage);
  return res.send(resourceCost);
});

//Get Single
router.get("/:id", auth, async (req, res) => {
  let resourceCost;
  try {
    resourceCost = await ResourceCost.findById(req.params.id);
    if (!resourceCost)
      return res.status(400).send("Resource Cost with given id is not present");
    else {
      return res.send(resourceCost);
    }
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

/* Add New Resource Cost */
router.post("/", auth, async (req, res) => {
  let resourceCost = await ResourceCost.findOne({
    name: req.body.name,
  });
  if (resourceCost)
    return res
      .status(400)
      .send("Resource Cost Policy With Given Name Already Exsists");
  resourceCost = new ResourceCost(req.body);
  resourceCost
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

//Update Resource Cost
router.put("/:id", auth, async (req, res) => {
  try {
    let resourceCost = await ResourceCost.findById(req.params.id);
    console.log(resourceCost);
    if (!resourceCost)
      return res.status(400).send("Working Hours with given id is not present");
    resourceCost = extend(resourceCost, req.body);
    await resourceCost.save();
    return res.send(resourceCost);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let resourceCost = await ResourceCost.findByIdAndDelete(req.params.id);
    if (!resourceCost) {
      return res
        .status(400)
        .send("Working days policy with given id is not present"); // when there is no id in db
    }
    return res.send(resourceCost); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

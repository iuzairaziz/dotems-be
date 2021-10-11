var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Accessories } = require("../../model/accessories");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-accessory", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let accessories = await Accessories.find()
    .sort({
      createdAt: -1,
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(accessories);
});

/*Add new Designation*/
router.post("/create-accessory", auth, async (req, res) => {
  let accessories = await Accessories.findOne({
    name: req.body.name,
  });
  if (accessories)
    return res.status(400).send("Accessories With Given Name Already Exsists");
  accessories = new Accessories(req.body);
  accessories
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
    let accessories = await Accessories.findById(req.params.id);
    console.log(accessories);
    if (!accessories)
      return res.status(400).send("Accessories with given id is not present");
    accessories = extend(accessories, req.body);
    await accessories.save();
    return res.send(accessories);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let accessories = await Accessories.findByIdAndDelete(req.params.id);
    if (!accessories) {
      return res.status(400).send("Accessories with given id is not present"); // when there is no id in db
    }
    return res.send(accessories); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

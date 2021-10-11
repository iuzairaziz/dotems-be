var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Nature } = require("../../model/nature");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-nature", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let nature = await Nature.find().skip(skipRecords).limit(perPage);
  return res.send(nature);
});

/*Add new Designation*/
router.post("/create-nature", auth, async (req, res) => {
  let nature = await Nature.findOne({
    name: req.body.name,
  });
  if (nature)
    return res.status(400).send("Nature With Given Name Already Exsists");
  nature = new Nature(req.body);
  nature
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
    let nature = await Nature.findById(req.params.id);
    console.log(nature);
    if (!nature)
      return res.status(400).send("Nature with given id is not present");
    nature = extend(nature, req.body);
    await nature.save();
    return res.send(nature);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let nature = await Nature.findByIdAndDelete(req.params.id);
    if (!nature) {
      return res.status(400).send("Nature with given id is not present"); // when there is no id in db
    }
    return res.send(nature); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

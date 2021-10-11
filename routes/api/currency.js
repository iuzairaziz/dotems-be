var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Currency } = require("../../model/currency");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-currency", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let currency = await Currency.find().skip(skipRecords).limit(perPage);
  return res.send(currency);
});

/*Add new Designation*/
router.post("/create-currency", auth, async (req, res) => {
  let currency = await Currency.findOne({
    name: req.body.name,
  });
  if (currency)
    return res.status(400).send("Currency With Given Name Already Exsists");
  currency = new Currency(req.body);
  currency
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
    let currency = await Currency.findById(req.params.id);
    console.log(currency);
    if (!currency)
      return res.status(400).send("Currency with given id is not present");
    currency = extend(currency, req.body);
    await currency.save();
    return res.send(currency);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let currency = await Currency.findByIdAndDelete(req.params.id);
    if (!currency) {
      return res.status(400).send("Currency with given id is not present"); // when there is no id in db
    }
    return res.send(currency); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

router.get("/:id", async (req, res) => {
  try {
    let currency = await Currency.findById(req.params.id);
    if (!currency) {
      return res.status(400).send("Currency with given id is not present"); // when there is no id in db
    }
    return res.send(currency); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

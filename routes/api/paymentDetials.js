var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { PaymentDetial } = require("../../model/paymentDetials");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let payment = await PaymentDetial.find()
    .populate({
      path: "project",
      populate: { path: "currency", model: "Currency" },
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(payment);
});

router.get("/:id", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let payment = await PaymentDetial.findById(req.params.id)
    .populate({
      path: "project",
      populate: { path: "currency", model: "Currency" },
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(payment);
});

/*Add new Designation*/
router.post("/", auth, async (req, res) => {
  let payment = await PaymentDetial.findOne({
    project: req.body.project,
  });
  if (payment) {
    payment.paymentDetials = [
      ...payment.paymentDetials,
      req.body.paymentDetials,
    ];
  } else {
    payment = new PaymentDetial(req.body);
  }
  payment
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
    let payment = await PaymentDetial.findById(req.params.id);
    console.log(payment);
    if (!payment)
      return res.status(400).send("Payment with given id is not present");
    payment = extend(payment, req.body);
    await payment.save();
    return res.send(payment);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let payment = await PaymentDetial.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(400).send("Payment with given id is not present"); // when there is no id in db
    }
    return res.send(payment); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var moment = require("moment");
var router = express.Router();
const { Expense } = require("../../model/expense");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-expense", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let startDate = req.query.startDate ? req.query.startDate : "";
  let requestObject = {};
  if (startDate === "null" || startDate === "") {
    let startdate = {};
    startdate1 = "1-1-1990";
    startdate.$gte = moment(startdate1).startOf("day");
    requestObject.date = startdate;
  } else {
    requestObject.date = moment(startDate).format("YYYY-MM-DD");
  }
  let skipRecords = perPage * (page - 1);
  let expense = await Expense.find(requestObject)
    .skip(skipRecords)
    .limit(perPage);
  console.log(requestObject);
  return res.send(expense);
});

/*Add new Designation*/
router.post("/create-expense", auth, async (req, res) => {
  let expense = await Expense.findOne({
    name: req.body.name,
  });
  if (expense)
    return res.status(400).send("Expense With Given Name Already Exsists");
  expense = Expense.insertMany(req.body)
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
    let expense = await Expense.findById(req.params.id);
    if (!expense)
      return res.status(400).send("Expense with given id is not present");
    expense = extend(expense, req.body);
    await expense.save();
    return res.send(expense);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(400).send("Expense with given id is not present"); // when there is no id in db
    }
    return res.send(expense); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { ExpenseCatgeory } = require("../../model/expenseCategory");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-expense-catgeory", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let expenseCatgeory = await ExpenseCatgeory.find()
    .skip(skipRecords)
    .limit(perPage);
  return res.send(expenseCatgeory);
});

/*Add new Designation*/
router.post("/create-expense-category", auth, async (req, res) => {
  let expenseCatgeory = await ExpenseCatgeory.findOne({
    name: req.body.name,
  });
  if (expenseCatgeory)
    return res
      .status(400)
      .send("Expense Catgeory With Given Name Already Exsists");
  expenseCatgeory = new ExpenseCatgeory(req.body);
  expenseCatgeory
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
    let expenseCatgeory = await ExpenseCatgeory.findById(req.params.id);
    console.log(expenseCatgeory);
    if (!expenseCatgeory)
      return res
        .status(400)
        .send("Expense Catgeory with given id is not present");
    expenseCatgeory = extend(expenseCatgeory, req.body);
    await expenseCatgeory.save();
    return res.send(expenseCatgeory);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let expenseCatgeory = await ExpenseCatgeory.findByIdAndDelete(
      req.params.id
    );
    if (!expenseCatgeory) {
      return res
        .status(400)
        .send("Expense Catgeory with given id is not present"); // when there is no id in db
    }
    return res.send(expenseCatgeory); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

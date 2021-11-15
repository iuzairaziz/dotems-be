var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { EmployeeDepartment } = require("../../model/employeeDepartment");

/* Get All Employee Department  */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let employeeDepartment = await EmployeeDepartment.find()
    .skip(skipRecords)
    .limit(perPage);
  return res.send(employeeDepartment);
});

/*Add New Employee Department*/
router.post("/", auth, async (req, res) => {
  let employeeDepartment = await EmployeeDepartment.findOne({
    name: req.body.name,
  });
  if (employeeDepartment)
    return res.status(400).send("Employee Department Already Exsists");
  employeeDepartment = new EmployeeDepartment(req.body);
  employeeDepartment
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Employee Department
router.put("/:id", auth, async (req, res) => {
  try {
    let employeeDepartment = await EmployeeDepartment.findById(req.params.id);
    console.log(employeeDepartment);
    if (!employeeDepartment)
      return res
        .status(400)
        .send("Employee Department With Given Id Is Not Present");
    // country = extend(country, req.body);
    employeeDepartment.name = req.body.name;
    await employeeDepartment.save();
    return res.send(employeeDepartment);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Employee Department
router.delete("/:id", auth, async (req, res) => {
  try {
    let employeeDepartment = await EmployeeDepartment.findByIdAndDelete(
      req.params.id
    );
    if (!employeeDepartment) {
      return res
        .status(400)
        .send("Employee Department With Given Id Is Not Present"); // when there is no id in db
    }
    return res.send(employeeDepartment); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Employee Department Id"); // when id is inavlid
  }
});

module.exports = router;

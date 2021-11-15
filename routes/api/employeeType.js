var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { EmployeeType } = require("../../model/employeeType");

/* Get All Employee Type  */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let employeeType = await EmployeeType.find().skip(skipRecords).limit(perPage);
  return res.send(employeeType);
});

/*Add new Employee Type*/
router.post("/", auth, async (req, res) => {
  let employeeType = await EmployeeType.findOne({
    name: req.body.name,
  });
  if (employeeType)
    return res.status(400).send("Employee Type Already Exsists");
  employeeType = new EmployeeType(req.body);
  employeeType
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Employee Type
router.put("/:id", auth, async (req, res) => {
  try {
    let employeeType = await EmployeeType.findById(req.params.id);
    console.log(employeeType);
    if (!employeeType)
      return res.status(400).send("Employee Type With Given Id Is Not Present");
    // country = extend(country, req.body);
    employeeType.name = req.body.name;
    await employeeType.save();
    return res.send(employeeType);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Employee Type
router.delete("/:id", auth, async (req, res) => {
  try {
    let employeeType = await EmployeeType.findByIdAndDelete(req.params.id);
    if (!employeeType) {
      return res.status(400).send("Employee Type With Given Id Is Not Present"); // when there is no id in db
    }
    return res.send(employeeType); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Employee Type Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Role } = require("../../model/role");
const auth = require("../../middlewares/auth");

/* Get All Roles And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let role = await Role.find().skip(skipRecords).limit(perPage);
  return res.send(role);
});

/*Add new Role*/
router.post("/", auth, async (req, res) => {
  let role = await Role.findOne({
    name: req.body.name,
  });
  if (role)
    return res.status(400).send("Role With Given Name Already Exsists");
  role = new Role(req.body);
  role
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Role
router.put("/:id", auth, async (req, res) => {
  try {
    let role = await Role.findById(req.params.id);
    console.log(role);
    if (!role)
      return res.status(400).send("Role with given id is not present");
    role = extend(role, req.body);
    await role.save();
    return res.send(role);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Role
router.delete("/:id", auth, async (req, res) => {
  try {
    let role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(400).send("Role with given id is not present"); // when there is no id in db
    }
    return res.send(role); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Status Id"); // when id is inavlid
  }
});

module.exports = router;

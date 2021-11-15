var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { RolePermission } = require("../../model/rolePermission");
const auth = require("../../middlewares/auth");

/* Get All Roles And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let role = await RolePermission.find().skip(skipRecords).limit(perPage);
  return res.send(role);
});

/*Add new Role*/
router.post("/", auth, async (req, res) => {
  let rolePermission = await RolePermission.findOne({
    name: req.body.name,
  });
  if (rolePermission)
    return res.status(400).send("Role With Given Name Already Exsists");
    rolePermission = new RolePermission(req.body);
    rolePermission
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
    let rolePermission = await RolePermission.findById(req.params.id);
    console.log(rolePermission);
    if (!rolePermission)
      return res.status(400).send("Role with given id is not present");
      rolePermission = extend(rolePermission, req.body);
    await rolePermission.save();
    return res.send(rolePermission);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Role
router.delete("/:id", auth, async (req, res) => {
  try {
    let rolePermission = await RolePermission.findByIdAndDelete(req.params.id);
    if (!rolePermission) {
      return res.status(400).send("Role with given id is not present"); // when there is no id in db
    }
    return res.send(rolePermission); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Status Id"); // when id is inavlid
  }
});

module.exports = router;

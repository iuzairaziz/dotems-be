var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { RolePermission } = require("../../model/rolePermission");
const auth = require("../../middlewares/auth");
const Mongoose = require("mongoose");

/* Get All Roles And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let role = await RolePermission.find().skip(skipRecords).limit(perPage);
  return res.send(role);
});

router.get("/role/:roleId", auth, async (req, res) => {
  try {
    let permissions = await RolePermission.find({ role: req.params.roleId });
    if (permissions.length > 0) {
      res.status(200).send(permissions);
    } else {
      res.status(404).send("no record found");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

/*Add new Role*/
router.post("/", auth, async (req, res) => {
  try {
    const { permissions, role } = req.body;
    let records = [];
    console.log("role", role);
    permissions.map((p, pindex) => {
      p.pages.map((page, pageIndex) => {
        page.permissionOptions.map((po, poINdex) => {
          records.push({
            name: po.value,
            page: page.name,
            active: po.checked,
            role: Mongoose.Types.ObjectId(role),
          });
          if (po.subPermissions) {
            po.subPermissions.map((sp) => {
              records.push({
                name: sp.value,
                page: page.name,
                active: sp.checked,
                role: Mongoose.Types.ObjectId(role),
              });
            });
          }
        });
      });
    });

    let result = await RolePermission.bulkWrite(
      records.map((r) => {
        return {
          updateOne: {
            filter: {
              name: r.name,
              page: r.page,
              role: role,
            },
            update: { $set: r },
            upsert: true,
          },
        };
      })
      // { ordered: false }
    );

    res.send({ result });
  } catch (error) {
    console.log("error is", error);
    res.status(500).send({ error });
  }
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

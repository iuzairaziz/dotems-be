var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Machine } = require("../../model/machine");
const { User } = require("../../model/user");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/show-machine", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let machine = await Machine.aggregate([
    {
      $match: {
        _id: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "accessories",
        localField: "Accessory",
        foreignField: "_id",
        as: "Accessory",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "machineNo",
        as: "resourceName",
      },
    },
    {
      $unwind: { path: "$resourceName", preserveNullAndEmptyArrays: true },
    },
  ]);

  return res.send(machine);
});
router.get("/show-free-machine", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let machine = await Machine.find({ Status: "Free" })
    .populate("resourceName")
    .populate("Accessory")
    .sort({
      createdAt: -1,
    });
  return res.send(machine);
});

router.get("/single-machine/:machineId", async (req, res) => {
  try {
    let machine = await Machine.findById(req.params.machineId)
      .populate("resourceName")
      .populate("Accessory", "name")
      .sort({
        createdAt: -1,
      });
    if (!machine) {
      return res.status(404).send("Machine with given id is not present"); // when there is no id in db
    }
    return res.send(machine); // when everything is okay
  } catch (err) {
    console.log(err);
    return res.status(400).send("invalid id"); // when id is inavlid
  }
});

/*Add new Designation*/
router.post("/create-machine", async (req, res) => {
  let machine = await Machine.findOne({
    machineNo: req.body.machineNo,
  });
  if (machine) {
    return res.status(404).send("Machine With Given Number Already Exsists");
  }
  machine = new Machine(req.body);
  machine
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: err });
    });
});

// Update Designation
router.put("/:id", auth, async (req, res) => {
  try {
    let machine = await Machine.findById(req.params.id);

    if (req.body.Status === "Free") {
      let user = await User.updateMany(
        { machineNo: req.params.id },
        { $set: { machineNo: null } }
      );
      console.log("User", user);
    }

    if (!machine)
      return res.status(400).send("Machine with given id is not present");
    machine = extend(machine, req.body);
    await machine.save();

    return res.send(machine);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Designation
router.delete("/:id", auth, async (req, res) => {
  try {
    let machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(400).send("Machine with given id is not present"); // when there is no id in db
    }
    return res.send(machine); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Machine Id"); // when id is inavlid
  }
});

module.exports = router;

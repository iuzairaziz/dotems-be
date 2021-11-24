var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { TaskPrioirty } = require("../../model/taskPriority");

/* Get All taskPriority */
router.get("/show-taskpriority", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let taskpriority = await TaskPrioirty.find().skip(skipRecords).limit(perPage);
  return res.send(taskpriority);
});

/*Add new taskpriority*/
router.post("/create-taskpriority", auth, async (req, res) => {
  let taskpriority = await TaskPrioirty.findOne({
    name: req.body.name,
  });
  if (taskpriority)
    return res.status(400).send("Client Label With Given Name Already Exsists");
  taskpriority = new TaskPrioirty(req.body);
  taskpriority
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

router.put("/preset/:id", auth, async (req, res) => {
  try {
    let priorityPreset = await TaskPrioirty.findOne({ preset: true });
    if (priorityPreset) {
      priorityPreset.preset = false;
      await priorityPreset.save();
    }
    let label = await TaskPrioirty.findById(req.params.id);
    if (!label)
      return res.status(400).send("Task Priority with given id is not present");
    label.preset = true;
    await label.save();
    console.log(label);
    return res.send(label);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Update taskpriority
router.put("/:id", auth, async (req, res) => {
  try {
    let taskpriority = await TaskPrioirty.findById(req.params.id);
    console.log(taskpriority);
    if (!taskpriority)
      return res.status(400).send("Client Label with given id is not present");
    // country = extend(country, req.body);
    taskpriority.name = req.body.name;
    taskpriority.color = req.body.color;
    await taskpriority.save();
    return res.send(taskpriority);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete taskpriority
router.delete("/:id", auth, async (req, res) => {
  try {
    let taskpriority = await TaskPrioirty.findByIdAndDelete(req.params.id);
    if (!taskpriority) {
      return res.status(400).send("Client Label with given id is not present"); // when there is no id in db
    }
    return res.send(taskpriority); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Request } = require("../../model/request");
const auth = require("../../middlewares/auth");
const mongoose = require("mongoose");

/* Get All Request */

router.get("/show-request", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let request = await Request.find()
    .populate("user")
    .populate("requestRecievers", "name")
    .populate("requestType")
    .sort({
      createdAt: -1,
    });

  return res.send(request);
});

router.get("/show-recieved-request", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let request = await Request.find({
    requestRecievers: { _id: req.query.userId },
  })
    .populate("user")
    .populate("requestRecievers", "name")
    .populate("requestType")
    .sort({
      createdAt: -1,
    });

  return res.send(request);
});

router.get("/:id", auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id)
      .populate("user")
      .populate("requestRecievers", "name")
      .populate("requestType");
    return res.send(request); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.send(err);
  }
});

router.get("/myrequest/:id", auth, async (req, res) => {
  try {
    let request = await Request.find({
      user: req.params.id,
    })
      .populate("user")
      .populate("requestType");
    return res.send(request); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.send(err);
  }
});

router.get("myrequest/:id", auth, async (req, res) => {
  try {
    let request = await Request.find({
      user: req.params.id,
    })
      .populate("user")
      .populate("requestType");
    return res.send(request); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.send(err);
  }
});

/*Add new Request*/
router.post("/create-request", auth, async (req, res) => {
  request = new Request(req.body);
  request
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Request
router.put("/:id", auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    console.log(request);
    if (!request)
      return res.status(400).send("client with given id is not present");
    request = extend(request, req.body);
    await request.save();
    return res.send(request);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Request
router.delete("/:id", auth, async (req, res) => {
  try {
    let request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(400).send("client with given id is not present"); // when there is no id in db
    }
    return res.send(request); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

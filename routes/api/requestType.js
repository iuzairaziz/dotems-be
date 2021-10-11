var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { RequestType } = require("../../model/requestType");
const auth = require("../../middlewares/auth");

/* Get All Request */
router.get("/show-request-type", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let requestType = await RequestType.find()
    .sort({
      createdAt: -1,
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(requestType);
});

/*Add new Request*/
router.post("/create-request-type", auth, async (req, res) => {
  let requestType = await RequestType.findOne({
    name: req.body.name,
  });
  if (requestType) return res.status(404).send("Leave Type Already Exsists");
  requestType = new RequestType(req.body);
  requestType
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
    let requestType = await RequestType.findById(req.params.id);
    console.log(requestType);
    if (!requestType)
      return res.status(400).send("client with given id is not present");
    requestType = extend(requestType, req.body);
    await requestType.save();
    return res.send(requestType);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete Request
router.delete("/:id", auth, async (req, res) => {
  try {
    let requestType = await RequestType.findByIdAndDelete(req.params.id);
    if (!requestType) {
      return res.status(400).send("client with given id is not present"); // when there is no id in db
    }
    return res.send(requestType); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { History } = require("../../model/history");

/* Get All Designations And Users */
router.get("/show-history", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let history = await History.find().skip(skipRecords).limit(perPage);
  return res.send(history);
});

router.get("/show-single-history/:machineId", auth, async (req, res) => {
  let history = await History.find({ docId: req.params.machineId }).sort({
    createdAt: -1,
  });
  return res.send(history);
});

/*Add new Designation*/
router.post("/create-history", auth, async (req, res) => {
  history = new History(req.body);
  history
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: err });
    });
});

module.exports = router;

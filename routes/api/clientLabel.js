var express = require("express");
const auth = require("../../middlewares/auth");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { ClientLabel } = require("../../model/clientLabel");
const { Designation } = require("../../model/designation");

/* Get All clientlabels */
router.get("/show-clientlabel", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let clientlabel = await ClientLabel.find().skip(skipRecords).limit(perPage);
  return res.send(clientlabel);
});

/*Add new clientlabel*/
router.post("/create-clientlabel", auth, async (req, res) => {
  let clientlabel = await ClientLabel.findOne({
    name: req.body.name,
  });
  if (clientlabel)
    return res.status(400).send("Client Label With Given Name Already Exsists");
  clientlabel = new ClientLabel(req.body);
  clientlabel
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update clientlabel
router.put("/:id", auth, async (req, res) => {
  try {
    let clientlabel = await ClientLabel.findById(req.params.id);
    console.log(clientlabel);
    if (!clientlabel)
      return res.status(400).send("Client Label with given id is not present");
    // country = extend(country, req.body);
    clientlabel.name = req.body.name;
    await clientlabel.save();
    return res.send(clientlabel);
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete clientlabel
router.delete("/:id", auth, async (req, res) => {
  try {
    let clientlabel = await ClientLabel.findByIdAndDelete(req.params.id);
    if (!clientlabel) {
      return res.status(400).send("Client Label with given id is not present"); // when there is no id in db
    }
    return res.send(clientlabel); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Task Id"); // when id is inavlid
  }
});

module.exports = router;

var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Leave } = require("../../model/leave");
const { LeaveType } = require("../../model/leaveType");
const auth = require("../../middlewares/auth");
const { LeaveDetail } = require("../../model/leaveDetail");
var moment = require("moment");
const mongoose = require("mongoose");

/* Get All Leaves And Users */
router.get("/", auth, async (req, res) => {
  try {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let user = req.query.user ? req.query.user : "";
    let adminStatus = req.query.adminStatus ? req.query.adminStatus : "";
    let pmStatus = req.query.pmStatus ? req.query.pmStatus : "";
    let leaveStartDate = req.query.startDate ? req.query.startDate : "";
    let leaveEndDate = req.query.endDate ? req.query.endDate : "";
    let requestObject = {};
    let requestObject1 = {};
    let localArray = [{ $eq: ["$leave", "$$leaveId"] }];
    if (user) {
      requestObject.user = mongoose.Types.ObjectId(`${user}`);
    } else {
      null;
    }
    if (adminStatus) {
      requestObject.adminStatus = adminStatus;
    } else {
      null;
    }
    if (pmStatus) {
      requestObject.pmStatus = pmStatus;
    } else {
      null;
    }
    if (leaveStartDate != "") {
      console.log("else", leaveStartDate);
      leavestartdate = moment(leaveStartDate).startOf("day").toDate();
      requestObject1.startDate = leavestartdate;
      localArray.push({ $gte: ["$date", requestObject1.startDate] });
    }
    if (leaveEndDate != "") {
      console.log("else", leaveEndDate);
      leaveenddate = moment(leaveEndDate).startOf("day").toDate();
      requestObject1.endDate = leaveenddate;
      localArray.push({ $lte: ["$date", requestObject1.endDate] });
    }

    let leaves = await Leave.aggregate([
      { $match: requestObject },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "leavetypes",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "leavedetails",
          let: { leaveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: localArray,
                },
              },
            },
            // { $count: "usedLeaves" },
          ],
          as: "dates",
        },
      },
    ]).sort({
      createdAt: -1,
    });

    return res.send(leaves);
  } catch (err) {
    return res.send(err);
  }
});

/*Add new Leave*/
router.post("/new", auth, async (req, res) => {
  let leave = new Leave(req.body);
  leave
    .save()
    .then(async (resp) => {
      let leaveDeatil = await LeaveDetail.bulkWrite(
        req.body.dates.map((d) => {
          return {
            insertOne: {
              document: { leave: resp._id, date: moment(d).format("D-M-YYYY") },
            },
          };
        }),
        { ordered: false }
      );
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});
//update leave
router.put("/:id", auth, async (req, res) => {
  try {
    let leave = await Leave.findById(req.params.id);
    console.log(leave);
    if (!leave)
      return res.status(400).send("leave with given id is not present");
    leave = extend(leave, req.body);
    await leave.save();
    return res.send(leave);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let leaves = await Leave.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "leavetypes",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "leavedetails",
          localField: "_id",
          foreignField: "leave",
          as: "dates",
        },
      },
    ]);
    return res.send(leaves[0]); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.send(err);
  }
});

router.post("/remaining-leaves", auth, async (req, res) => {
  try {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let yearStart = moment().startOf("year").toDate();
    let yearEnd = moment().endOf("year").toDate();
    let moasnthStart = moment().utc().startOf("year").toDate();
    let monasdthEnd = moment().utc().endOf("year").toDate();
    const { leaveType, user } = req.body;
    let leaves = await Leave.aggregate([
      {
        $match: {
          type: mongoose.Types.ObjectId(leaveType),
          user: mongoose.Types.ObjectId(user),
          adminStatus: "approved",
        },
      },
      {
        $lookup: {
          from: "leavedetails",
          let: { leaveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$leave", "$$leaveId"] },
                    { $gte: ["$date", yearStart] },
                    { $lte: ["$date", yearEnd] },
                  ],
                },
              },
            },
            { $count: "usedLeaves" },
          ],
          as: "dates",
        },
      },
      { $unwind: { path: "$dates", preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, usedLeaves: { $sum: "$dates.usedLeaves" } } },
    ]);
    return res.send(leaves[0]); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post("/pending-leaves", auth, async (req, res) => {
  try {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let skipRecords = perPage * (page - 1);
    let yearStart = moment().startOf("year").toDate();
    let yearEnd = moment().endOf("year").toDate();
    let moasnthStart = moment().utc().startOf("year").toDate();
    let monasdthEnd = moment().utc().endOf("year").toDate();
    const { leaveType, user } = req.body;
    let leaves = await Leave.aggregate([
      {
        $match: {
          type: mongoose.Types.ObjectId(leaveType),
          user: mongoose.Types.ObjectId(user),
          adminStatus: "pending",
        },
      },
      {
        $lookup: {
          from: "leavedetails",
          let: { leaveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$leave", "$$leaveId"] },
                    { $gte: ["$date", yearStart] },
                    { $lte: ["$date", yearEnd] },
                  ],
                },
              },
            },
            { $count: "pendingLeaves" },
          ],
          as: "dates",
        },
      },
      { $unwind: { path: "$dates", preserveNullAndEmptyArrays: true } },
      {
        $group: { _id: null, pendingLeaves: { $sum: "$dates.pendingLeaves" } },
      },
    ]);
    return res.send(leaves[0]); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/remaining-leaves-all/:userId", auth, async (req, res) => {
  try {
    let page = Number(req.query.page ? req.query.page : 1);
    let perPage = Number(req.query.perPage ? req.query.perPage : 10);
    let yearStart = moment().startOf("year").toDate();
    let yearEnd = moment().endOf("year").toDate();
    let skipRecords = perPage * (page - 1);
    let leaves = await LeaveType.aggregate([
      {
        $lookup: {
          from: "leaves",
          let: { leaveTypeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$type", "$$leaveTypeId"] },
                    { $eq: ["$adminStatus", "approved"] },
                    {
                      $eq: [
                        "$user",
                        mongoose.Types.ObjectId(req.params.userId),
                      ],
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "leavedetails",
                let: { leaveId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$leave", "$$leaveId"] },
                          { $gte: ["$date", yearStart] },
                          { $lte: ["$date", yearEnd] },
                        ],
                      },
                    },
                  },
                  { $count: "usedLeaves" },
                ],
                as: "used",
              },
            },
            // { $count: "usedLeaves" },
            { $project: { used: 1 } },
            { $unwind: { path: "$used", preserveNullAndEmptyArrays: true } },
            { $group: { _id: null, usedLeaves: { $sum: "$used.usedLeaves" } } },
          ],
          as: "leaves",
        },
      },
      { $unwind: { path: "$leaves", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          remaining: { $subtract: ["$totalLeaves", "$leaves.usedLeaves"] },
        },
      },
      // { $group: { _id: null, usedLeaves: { $sum: "$dates.usedLeaves" } } },
    ]);
    return res.send(leaves); //aggregate always return array. in this case it always returns array of one element
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/user-all-leaves/:userId", auth, async (req, res) => {
  try {
    let leaves = await Leave.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.params.userId),
        },
      },
      {
        $lookup: {
          from: "leavetypes",
          foreignField: "_id",
          localField: "type",
          as: "type",
        },
      },
      {
        $unwind: { path: "$type", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "leavedetails",
          let: { leaveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$leave", "$$leaveId"] }],
                },
              },
            },
          ],
          as: "dates",
        },
      },
    ]);
    return res.send(leaves);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;

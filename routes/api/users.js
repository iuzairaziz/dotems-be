var express = require("express");
var router = express.Router();
const multer = require("multer");
var fs = require("fs");
var path = require("path");
const { extend } = require("lodash");
const { User } = require("../../model/user");
const { UserProfile } = require("../../model/userProfile");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { Tasks } = require("../../model/task");
const { Project } = require("../../model/project");
const Mongoose = require("mongoose");

var Storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: Storage,
  fileFilter: (req, file, cb) => {
    var typeArray = file.mimetype.split("/");
    var fileType = typeArray[1];
    if (fileType == "jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Invalid upload: Only JPEG IMAGES ALLOWED"));
    }
  },
}).single("image");

/* GET Users */
router.get("/", auth, async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  let technology = req.query.technology ? req.query.technology : "";
  let role = req.query.role ? req.query.role : "";
  let minSalary = req.query.minSalary ? req.query.minSalary : "";
  let maxSalary = req.query.maxSalary ? req.query.maxSalary : "";
  let requestObject = {};
  if (technology) {
    requestObject.technology = { $all: [`${technology}`] };
  } else {
    null;
  }
  if (role) {
    requestObject.userRole = role;
  } else {
    null;
  }
  if (minSalary && maxSalary) {
    requestObject.salary = { $gte: minSalary, $lte: maxSalary };
  } else {
    null;
  }
  let user = await User.find(requestObject)
    .populate("technology")
    .populate("machineNo", "machineNo")
    .populate("designation")
    .populate("role")
    .populate("employeeType")
    .populate("department")
    .populate("workingDays")
    .populate("workingHours")
    .populate("resourceCost")
    .populate("employeeManager")
    .sort({
      createdAt: -1,
    })
    .skip(skipRecords)
    .limit(perPage);
  return res.send(user);
});
router.get("/machine-resource", auth, async function (req, res, next) {
  let user = await User.find({ machineNo: req.body._id });
  return res.send(user);
});

/* Signup . */
router.post("/register", upload, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User With Given Email Already Exsists");
  user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.userRole = req.body.userRole;
  user.jobTitle = req.body.jobTitle;
  user.designation = req.body.designation;
  user.employeeType = req.body.employeeType;
  user.employeeManager = req.body.employeeManager;
  user.department = req.body.department;
  user.employeeStatus = req.body.employeeStatus;
  user.workingDays = req.body.workingDays;
  user.workingHours = req.body.workingHours;
  user.salary = req.body.salary;
  user.machineNo = req.body.machineNo;
  user.resourceCost = req.body.resourceCost;
  user.technology = req.body.technology;
  user.contactNo = req.body.contactNo;
  user.otherContactNo = req.body.otherContactNo;
  user.personalEmail = req.body.personalEmail;
  user.address = req.body.address;
  user.guardianName = req.body.guardianName;
  user.guardianContact = req.body.guardianContact;
  user.status = req.body.status;
  user.gender = req.body.gender;
  user.city = req.body.city;
  user.country = req.body.country;
  user.bankName = req.body.bankName;
  user.bankAccNo = req.body.bankAccNo;
  user.joiningDate = req.body.joiningDate;
  user.terminationDate = req.body.terminationDate;
  user.dateOfBirth = req.body.dateOfBirth;
  user.role = req.body.role;
  await user.generateHashedPassword();
  await user.save();
  return res.send(
    _.pick(user, [
      "name",
      "email",
      "gender",
      "salary",
      "status",
      "joiningDate",
      "userRole",
      "machineNo",
      "workingDays",
      "designation",
    ])
  );
});

// Sign In
router.post("/login", async (req, res) => {
  console.log(req.body);
  // let user = await User.findOne({ email: req.body.email });

  let user =
    User.aggregate[
      {
        $lookup: {
          from: "roles",
          let: { roleId: "$role" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$roleId", "$_id"],
                },
              },
            },
            {
              $lookup: {
                from: "rolepermissions",
                localField: "_id",
                foreignField: "role",
                as: "permissions",
              },
            },
          ],
          as: "role",
        },
      }
    ];
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  // let token = jwt.sign(
  //   {
  //     _id: user._id,
  //     name: user.name,
  //     status: user.status,
  //     userRole: user.role,
  //   },
  //   config.get("jwtPrivateKey")
  // );
  return res.send(user);
});

// Update User
router.put("/:id", auth, async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).send("User with given id is not present"); // when there is no id in db
  }
  user.technology = req.body.technology;
  user.contact = req.body.contact;
  user.otherContact = req.body.otherContact;
  user.emailPersonal = req.body.emailPersonal;
  user.address = req.body.address;
  user.contactEmergency = req.body.contactEmergency;
  user.nameEmergency = req.body.nameEmergency;

  user.save();
  return res.send(
    _.pick(user, [
      "technology",
      "contact",
      "otherContact",
      "emailPersonal",
      "address",
      "contactEmergency",
      "nameEmergency",
    ])
  );
});

router.put("/update-password/:id", auth, async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).send("User with given id is not present"); // when there is no id in db
  }
  let isValid = await bcrypt.compare(req.body.oldPassword, user.password);
  if (isValid) {
    user.password = req.body.password;
    await user.generateHashedPassword();
    await user.save();
    return res.send("Password Changed Successfully");
  }
  return res.send("Invalid Old Password");
});

router.put("/update-user/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    console.log(user);
    if (!user) return res.status(400).send("User with given id is not present");
    console.log("request Nody", req.body.password);
    console.log("user password", user.password);

    if (req.body.password !== user.password) {
      console.log("request Body shgahshahs", req.body.password);
      console.log("user password", user.password);
      user = extend(user, req.body);
      await user.generateHashedPassword();
      await user.save();
    } else {
      user = extend(user, req.body);
      await user.save();
    }

    return res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});
// router.put("/update-user/:id", auth, async (req, res) => {
//   let user = await User.findById(req.params.id);
//   if (!user) {
//     return res.status(400).send("User with given id is not present"); // when there is no id in db
//   }
//   user.name = req.body.name;
//   user.email = req.body.email;
//   user.gender = req.body.gender;
//   user.status = req.body.status;
//   user.joiningDate = req.body.joiningDate;
//   user.password = req.body.password;
//   user.salary = req.body.salary;
//   user.workingHrs = req.body.workingHrs;
//   user.machineNo = req.body.machineNo;
//   user.workingDays = req.body.workingDays;
//   user.userRole = req.body.userRole;
//   await user.generateHashedPassword();
//   await user.save();
//   return res.send(user);
// });

router.get("/:id", auth, async (req, res) => {
  let tasks, user;
  try {
    user = await User.findById(req.params.id)
      .populate("technology")
      .populate("designation")
      .populate("machineNo", "machineNo")
      .populate("role")
      .populate("employeeType")
      .populate("department")
      .populate("workingDays")
      .populate("workingHours")
      .populate("resourceCost")
      .populate("employeeManager");

    if (!user) {
      return res.status(400).send("user profile with given id is not present"); // when there is no id in db
    }
  } catch (err) {
    console.log("error=", err);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
  try {
    tasks = await Tasks.find({ assignedTo: { _id: req.params.id } })
      .populate("project")
      .populate("teamLead")
      .populate("addedBy");
  } catch (error) {
    return res
      .status(404)
      .send("Something went wrong while finding user tasks"); // when id is inavlid
  }
  return res.send({ user, tasks }); // when everything is okay
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).send("User with given id is not present"); // when there is no id in db
    }
    return res.send(user); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

router.get("/by-project/:id", auth, async (req, res) => {
  try {
    let users = await Project.aggregate([
      { $match: { _id: Mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "assignedUser",
          foreignField: "_id",
          as: "assignedUser",
        },
      },
      { $project: { _id: 0, assignedUser: 1 } },
      { $unwind: { path: "$assignedUser" } },
      { $replaceRoot: { newRoot: "$assignedUser" } },
    ]);
    if (!users) {
      return res.status(400).send("project with given id is not present"); // when there is no id in db
    }
    return res.send(users); // when everything is okay
  } catch (err) {
    console.log(err);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;

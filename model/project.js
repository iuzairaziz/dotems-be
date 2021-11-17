const mongoose = require("mongoose");

const projectScheme = mongoose.Schema(
  {
    name: String,
    cStartDate: Date,
    cEndDate: Date,
    pmStartDate: Date,
    pmEndDate: Date,
    description: String,
    estHrs: Number,
    remarks: String,
    workdone: String,
    projectType: String,
    cost: Number,
    currency: String,
    hourlyCost: {
      type: Number,
      default: 0,
    },
    clientHours: {
      type: Number,
      default: 0,
    },
    orderNum: String,
    Rprofit: {
      type: Number,
      default: 0,
    },
    Pdeduction: {
      type: Number,
      default: 0,
    },
    otherDeduction: {
      type: Number,
      default: 0,
    },
    percentage: String,
    fCost: String,
    phase: [
      {
        index: Number,
        phasename: String,
        estHrs: Number,
        outSourceCost: { default: null, type: Number },
        outSourceName: { type: String, default: null },
        outSourceDeadline: { type: Date, default: null },
      },
    ],
    // outSource: [
    //   {
    //     index: Number,
    //     phasename: String,
    //   },
    // ],
    technology: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],

    nature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nature",
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // currency: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Currency",
    // },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      {},
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectScheme);

module.exports.Project = Project;

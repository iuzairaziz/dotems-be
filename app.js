var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");

var logger = require("morgan");
var mongoose = require("mongoose");
var config = require("config");

var indexRouter = require("./routes/index");
var apiUserRouter = require("./routes/api/users");
var apiProjectRouter = require("./routes/api/project");
var apiTasksRouter = require("./routes/api/tasks");
var apiDesignationRouter = require("./routes/api/designation");
var apiTechnologiesRouter = require("./routes/api/technologies");
var apiClientRouter = require("./routes/api/client");
var apiNatureRouter = require("./routes/api/nature");
var apiPlatformRouter = require("./routes/api/platform");
var apiServiceRouter = require("./routes/api/service");
// var apiCountryRouter = require("./routes/api/country");
var apiUserProfileRouter = require("./routes/api/userProfile");
var apiTimesheetRouter = require("./routes/api/timesheet");
var apiCurrencyRouter = require("./routes/api/currency");
var apiStatusRouter = require("./routes/api/status");
var apiExpenseCategoryRouter = require("./routes/api/expenseCategory");
var apiExpenseRouter = require("./routes/api/expense");
var apiCommentRouter = require("./routes/api/comments");
var apiMachineRouter = require("./routes/api/machine");
var apiAccessoriesRouter = require("./routes/api/accessories");
var apiHistoryRouter = require("./routes/api/history");
var apiLeaveTypeRouter = require("./routes/api/leaveType");
var apiRequestTypeRouter = require("./routes/api/requestType");
var apiRequestRouter = require("./routes/api/request");
var apiLeaveRouter = require("./routes/api/leave");
var apiPaymentRouter = require("./routes/api/paymentDetials");
var apiLeaveSettingRouter = require("./routes/api/leaveSettings");
var apiRequestComments = require("./routes/api/requestComments");
var apiRoleRouter = require("./routes/api/role");
var apiRolePermissionRouter = require("./routes/api/rolePermission");
var apitaskPriorityRouter = require("./routes/api/taskPriority");

// var apiRequestComments = require("./routes/api/requestComments");
var apiEmployeeType = require("./routes/api/employeeType");
var apiEmployeeDepartment = require("./routes/api/employeeDepartment");
var apiClientLabel = require("./routes/api/clientLabel");

var apiWorkingDays = require("./routes/api/workingDays");
var apiWorkingHours = require("./routes/api/workingHours");
var apiWorkingShift = require("./routes/api/workingShift");
var apiResourceCost = require("./routes/api/resourceCost");
var apiLeavePolicy = require("./routes/api/leavePolicy");
var apiLeavePolicyTimeOff = require("./routes/api/leavePolicyTimeOffs");
// var apiTimeIn = require("./routes/api/timeInAttendance");
var apiTimeOut = require("./routes/api/Attendance");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", apiUserRouter);
app.use("/projects", apiProjectRouter);
app.use("/tasks", apiTasksRouter);
app.use("/task-priority", apitaskPriorityRouter);
app.use("/designation", apiDesignationRouter);
app.use("/technologies", apiTechnologiesRouter);
app.use("/client", apiClientRouter);
app.use("/nature", apiNatureRouter);
app.use("/platform", apiPlatformRouter);
app.use("/service", apiServiceRouter);
// app.use("/country", apiCountryRouter);
app.use("/profile", apiUserProfileRouter);
app.use("/timesheet", apiTimesheetRouter);
app.use("/currency", apiCurrencyRouter);
app.use("/status", apiStatusRouter);
app.use("/expense-category", apiExpenseCategoryRouter);
app.use("/expense", apiExpenseRouter);
app.use("/comment", apiCommentRouter);
app.use("/machine", apiMachineRouter);
app.use("/accessory", apiAccessoriesRouter);
app.use("/history", apiHistoryRouter);
app.use("/leave-type", apiLeaveTypeRouter);
app.use("/request-type", apiRequestTypeRouter);
app.use("/request", apiRequestRouter);
app.use("/leave", apiLeaveRouter);
app.use("/payment", apiPaymentRouter);
app.use("/leave-setting", apiLeaveSettingRouter);
app.use("/request-comment", apiRequestComments);
app.use("/role", apiRoleRouter);
app.use("/role-permission", apiRolePermissionRouter);

app.use("/employee-type", apiEmployeeType);
app.use("/employee-department", apiEmployeeDepartment);
app.use("/client-label", apiClientLabel);

app.use("/working-days", apiWorkingDays);
app.use("/working-hours", apiWorkingHours);
app.use("/working-shift", apiWorkingShift);
app.use("/leave-policy", apiLeavePolicy);
app.use("/leave-policy-detail", apiLeavePolicyTimeOff);
app.use("/resource-cost", apiResourceCost);

app.use("/attendance", apiTimeOut);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection Not Established");
  });

module.exports = app;

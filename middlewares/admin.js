async function admin(req, res, next) {
  if (
    req.user.role != "Admin" ||
    req.user.role != "Project Manager" ||
    req.user.role != "CEO"
  )
    return res.status(403).send("User Not Authorized");
  next();
}
module.exports = admin;

async function getRoleMiddleware(req, res, next) {
  if (!req.body?.token) {
    req.role = "unauthenticated";
    return next();
  }
  const User = req.app.get("models").User;
  const UserToCheck = await User.findOne({token : req.body.token});
  if (!UserToCheck) {
    req.role = "unauthenticated";
    return next();
  }
  req.role = UserToCheck.role;
  return next();
}

module.exports = getRoleMiddleware;
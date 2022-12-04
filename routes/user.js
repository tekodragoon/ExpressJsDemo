const {
  usersGet,
  userCreate,
  userDelete,
  userUpdate,
  userGet,
  userUpdateRole,
  userAccount,
} = require("../controllers/user");

function userRoute(app) {
  // Create
  app.post("/user/create", userCreate);
  // Read
  app.get("/user/showall", usersGet);
  // Read Single
  app.get("/user/show", userGet);
  // Update
  app.post("/user/update", userUpdate);
  // Update Role
  app.post("/user/updateRole", userUpdateRole);
  // Delete
  app.post("/user/delete", userDelete);
  // Account
  app.get("/account", userAccount);
}

module.exports = userRoute;

const { usersGet, userCreate, userDelete, userUpdate, userGet, userUpdateRole } = require("../controllers/user");

function userRoute(app) {
  // Create
  app.post("/userCreate", userCreate);
  // Read
  app.get("/users", usersGet );
  // Read Single
  app.get("/user", userGet);
  // Update
  app.post("/userUpdate", userUpdate);
  // Update Role
  app.post("/userUpdateRole", userUpdateRole);
  // Delete
  app.post("/userDelete", userDelete);
}

module.exports = userRoute;
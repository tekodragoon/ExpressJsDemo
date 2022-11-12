const { registerGet, registerPost } = require("../controllers/register");

function registerRoute(app) {
  app.get("/register", registerGet);
  app.post("/register", registerPost);
}

module.exports = registerRoute;

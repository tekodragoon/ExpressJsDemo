const { loginGet } = require("../controllers/login");

function loginRoute(app) {
  app.get("/login", loginGet);
}

module.exports = loginRoute;

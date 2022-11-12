const { coachCreate, coachGet, coachUpdate, coachDelete } = require("../controllers/coach");

function coachRoute(app) {
  // Create
  app.post("/coachCreate", coachCreate);

  // Read
  app.get("/coaches", coachGet);

  // Update
  app.post("/coachUpdate", coachUpdate);

  // Delete
  app.post("/coachDelete", coachDelete);
}

module.exports = coachRoute;
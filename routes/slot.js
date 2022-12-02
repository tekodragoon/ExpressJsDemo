const { slotCreate, slotGet, slotUpdate, slotDelete, slotBook } = require("../controllers/slot");

function slotRoute(app) {
  // Create
  app.post("/slotCreate", slotCreate);

  // Read
  app.get("/slots", slotGet);

  // Update
  app.post("/slotUpdate", slotUpdate);

  // Delete
  app.post("/slotDelete", slotDelete);

  // Book
  app.post("/slotBook", slotBook);
}

module.exports = slotRoute;
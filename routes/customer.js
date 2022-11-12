const { customerCreate, customerGet, customerUpdate, customerDelete } = require("../controllers/customer");

function customerRoute(app) {
  // Create
  app.post("/customerCreate", customerCreate);

  // Read
  app.get("/customers", customerGet);

  // Update
  app.post("/customerUpdate", customerUpdate);

  // Delete
  app.post("/customerDelete", customerDelete);
}

module.exports = customerRoute;
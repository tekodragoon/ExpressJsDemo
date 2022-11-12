const { subscriptionCreate, subscriptionGet, subscriptionUpdate, subscriptionDelete } = require("../controllers/subscription");

function subscriptionRoute(app) {
  // Create
  app.post("/subscriptionCreate", subscriptionCreate);

  // Read
  app.get("/subscriptions", subscriptionGet);

  // Update
  app.post("/subscriptionUpdate", subscriptionUpdate);

  // Delete
  app.post("/subscriptionDelete", subscriptionDelete);
}

module.exports = subscriptionRoute;
const {
  subscriptionCreate,
  subscriptionGet,
  subscriptionUpdate,
  subscriptionDelete,
  subscribeNow,
} = require("../controllers/subscription");

function subscriptionRoute(app) {
  // Create
  app.post("/subscriptionCreate", subscriptionCreate);

  // Read
  app.get("/subscriptions", subscriptionGet);

  // Subscribe
  app.get("/subscribe", subscribeNow);

  // Update
  app.post("/subscriptionUpdate", subscriptionUpdate);

  // Delete
  app.post("/subscriptionDelete", subscriptionDelete);
}

module.exports = subscriptionRoute;

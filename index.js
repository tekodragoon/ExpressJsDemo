const express = require("express");
const mongoose = require("mongoose");

const models = require("./models");
const getRoleMiddleware = require("./utils/getRoleMiddleware");

mongoose.connect("mongodb://localhost/sportCenters");

const app = express();

app.set("models", models);

const userRoute = require("./routes/user");
const customerRoute = require("./routes/customer");
const coachRoute = require("./routes/coach");
const subscriptionRoute = require("./routes/subcription");
const slotRoute = require("./routes/slot");

app.use(express.json());
app.use(getRoleMiddleware);

userRoute(app);
customerRoute(app);
coachRoute(app);
subscriptionRoute(app);
slotRoute(app);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => {
  console.log("Server successfully launched");
});
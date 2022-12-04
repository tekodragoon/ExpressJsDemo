if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const models = require("./models");
const getRoleMiddleware = require("./utils/getRoleMiddleware");
const utils = require("./utils/utils");

const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(console.log("Successfully connect to database"))
  .catch((err) => console.log(err));

const app = express();

app.set("models", models);
app.set("view-engine", "ejs");

const userRoute = require("./routes/user");
const customerRoute = require("./routes/customer");
const coachRoute = require("./routes/coach");
const subscriptionRoute = require("./routes/subcription");
const slotRoute = require("./routes/slot");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");

app.use(express.json());
app.use(getRoleMiddleware);
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbUrl }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  models.User.findById(id, function (e, user) {
    done(e, user);
  });
});
const LocalStrategy = require("passport-local").Strategy;
const decryptPassword = require("./utils/decryptPassword");
passport.use(
  new LocalStrategy(
    {
      usernameField: "login",
      passwordField: "password",
    },
    async (login, password, done) => {
      try {
        const user = await models.User.findOne({ login: login });
        if (!user)
          return done(null, false, { message: "invalid login or password" });
        const isMatch = decryptPassword(user, password);
        if (!isMatch)
          return done(null, false, { message: "invalid login or password" });
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);

//TODO: create auth middleware

app.use("/user", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  if (req.user.role !== "manager") {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  next();
})

app.use("/slots", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
})

app.use("/account", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
})

userRoute(app);
customerRoute(app);
coachRoute(app);
subscriptionRoute(app);
slotRoute(app);
loginRoute(app);
registerRoute(app);

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role == "customer") {
      const customer = await models.Customer.findById(req.user.customerId);
      return res.render("index.ejs", {
        user: req.user,
        customer: customer
      });
    }
    return res.render("index.ejs", {
      user: req.user,
    });
  }
  return res.render("index.ejs", {
    name: "Anonym",
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server successfully launched");
});

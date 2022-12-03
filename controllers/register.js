const encryptPassword = require("../utils/encryptPassword");

async function registerGet(req, res) {
  return res.render('register.ejs');
}

async function registerPost(req, res) {
  try {
    if (!req.body.lastName) {
      req.flash("error", "No lastName provided");
      return res.redirect("back");
    }
    if (!req.body.firstName) {
      req.flash("error", "No firstName provided");
      return res.redirect("back");
    }
    if (!req.body.login) {
      req.flash("error", "No login provided");
      return res.redirect("back");
    }
    if (!req.body.password) {
      req.flash("error", "No password provided");
      return res.redirect("back");
    }

    const {token, salt, hash} = encryptPassword(req.body.password);

    const models = req.app.get("models");

    const alreadyExist = await models.User.findOne({login: req.body.login});
    if (alreadyExist) {
      req.flash("error", "login already used");
      return res.redirect("back");
    }

    const newUser = await new models.User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      birthdate: new Date("2030-01-01"),
      login: req.body.login,
    }).save();

    const customer = await new models.Customer({
      user: newUser._id,
      subcriptions: [],
      level: "beginner"
    }).save();
    newUser.customerId = customer._id;
    await newUser.save();
    
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

module.exports = {registerGet, registerPost};
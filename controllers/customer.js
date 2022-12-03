// const { models } = require("mongoose");
const encryptPassword = require("../utils/encryptPassword");
const { errorMessage } = require("../utils/utils");

async function customerCreate(req, res) {
  if (req.user.role !== "manager") {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  try {
    if (!req.body.lastName) {
      req.flash("error", errorMessage("Lastname"));
      return res.redirect('back');
    }
    if (!req.body.firstName) {
      req.flash("error", errorMessage("Firstname"));
      return res.redirect('back');
    }
    if (!req.body.birthdate) {
      req.flash("error", errorMessage("Birthdate"));
      return res.redirect('back');
    }
    if (!req.body.role) {
      req.flash("error", errorMessage("Role"));
      return res.redirect('back');
    }
    if (!req.body.login) {
      req.flash("error", errorMessage("Login"));
      return res.redirect('back');
    }
    if (!req.body.password) {
      req.flash("error", errorMessage("Password"));
      return res.redirect('back');
    }
    
    const models = req.app.get("models");
    const {token, salt, hash} = encryptPassword(req.body.password);

    const newUser = await new models.User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      birthdate: req.body.birthdate,
      role: req.body.role,
      login: req.body.login
    }).save();

    const customer = await new models.Customer({
      user: newUser._id,
      subscriptions: [],
      level: "beginner"
    }).save();

    newUser.customerId = customer._id;
    await newUser.save();

    req.flash("info", "Customer successfully created");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

module.exports = { customerCreate };
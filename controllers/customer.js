const { models } = require("mongoose");
const encryptPassword = require("../utils/encryptPassword");
const { errorMessage } = require("../utils/utils");

async function customerGet(req, res) {
  try {
    const Customer = req.app.get("models").Customer;
    const MyCustomers = await Customer.find().populate("user").populate("subscriptions");
    if (!MyCustomers) {
      return res.json("Error find customers");
    }
    return res.json(MyCustomers);
  } catch (error) {
    return res.json(error.message);
  }
}

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
      role: req.body.role
    }).save();

    await new models.Customer({
      user: newUser._id,
      subcriptions: req.body.subcriptions ?? [],
      level: req.body.level ?? "beginner"
    }).save();

    req.flash("info", "Customer successfully created");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function customerUpdate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id || !req.body.toModify) {
      return res.json("_id or toModify missing");
    }
    const Customer = req.app.get("models").Customer;
    const CustomerToModify = await Customer.findById(req.body._id);
    if (!CustomerToModify) {
      return res.json("Customer not found");
    }
    const KeysToModify = Object.keys(req.body.toModify);
    for (const key of KeysToModify) {
      CustomerToModify[key] = req.body.toModify[key];
    }
    await CustomerToModify.save();
    return res.json(CustomerToModify);
  } catch (error) {
    return res.json(error.message);
  }
}

async function customerDelete(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      return res.json("_id missing");
    }
    const Customer = req.app.get("models").Customer;
    const CustomerToDelete = await Customer.findById(req.body._id);
    if (!CustomerToDelete) {
      return res.json("Customer not found");
    }
    const UserToDelete = await models.User.findById(CustomerToDelete.user);
    if (!UserToDelete) {
      return res.json("User not found");
    }
    await UserToDelete.remove();
    await CustomerToDelete.remove();
    return res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = { customerGet, customerCreate, customerUpdate, customerDelete };
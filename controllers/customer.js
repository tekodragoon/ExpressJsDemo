const { models } = require("mongoose");
const encryptPassword = require("../utils/encryptPassword");

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
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body.password) {
      return res.json("No password provided");
    }
    
    const models = req.app.get("models");
    const {token, salt, hash} = encryptPassword(req.body.password);
    const newUser = await new models.User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      dateOfBirth: req.body.dateOfBirth,
      role: req.body.role ?? "customer"
    }).save();
    const newCustomer = await new models.Customer({
      user: newUser._id,
      subcriptions: req.body.subcriptions ?? [],
      level: req.body.level ?? "beginner"
    }).save();
    return res.json(newCustomer);
  } catch (error) {
    return res.json(error.message);
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
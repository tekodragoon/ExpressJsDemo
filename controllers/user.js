const encryptPassword = require("../utils/encryptPassword");

async function userGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const MyUsers = await User.find();
    return res.render("users.ejs", {user: req.user, users: MyUsers});
  } catch (error) {
    return res.json(error.message);
  }
}

async function userCreate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body.password) {
      return res.json("No password provided");
    }
    const {token, salt, hash} = encryptPassword(req.body.password);

    const User = req.app.get("models").User;

    const NewUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      dateOfBirth: req.body.dateOfBirth,
    }).save();
    return res.json(NewUser);
  } catch (error) {
    return res.json(error.message);
  }
}

async function userDelete(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      return res.json("_id missing");
    }
    const User = req.app.get("models").User;
    const UserToDelete = await User.findById(req.body._id);
    await UserToDelete.remove();
    return res.json("Successfully deleted");
  } catch (error) {
    return res.json(error.message);
  }
}

async function userUpdate(req, res) {
  if (req.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id || !req.body.toModify) {
      return res.json("_id or modify fields missing");
    }
    const User = req.app.get("models").User;
    const UserToModify = await User.findById(req.body._id);
    const KeysToModify = Object.keys(req.body.toModify);
    for (const key of KeysToModify) {
      UserToModify[key] = req.body.toModify[key];
    }
    await UserToModify.save();
    return res.json(UserToModify);
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = { userGet, userCreate, userDelete, userUpdate };

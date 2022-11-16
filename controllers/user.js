const encryptPassword = require("../utils/encryptPassword");

async function usersGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const MyUsers = await User.find();
    return res.render("users.ejs", {user: req.user, users: MyUsers});
  } catch (error) {
    return res.json(error.message);
  }
}

async function userGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const user = await User.findById(req.query.id);
    return res.render("user.ejs", {user: req.user, myUser: user});
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
      birthdate: req.body.birthdate,
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
  if (req.user.role !== "manager") {
    return res.json("unauthorized");
  }
  try {
    if (!req.body._id) {
      req.flash("error", "_id or modify fields missing");
      return res.redirect('back');
    }
    if (!req.body.lastName) {
      req.flash("error", "lastName fields missing");
      return res.redirect('back');
    }
    if (!req.body.firstName) {
      req.flash("error", "firstName fields missing");
      return res.redirect('back');
    }
    if (!req.body.birthdate) {
      req.flash("error", "birthdate fields missing");
      return res.redirect('back');
    }
    if (!req.body.role) {
      req.flash("error", "role fields missing");
      return res.redirect('back');
    }
    const User = req.app.get("models").User;
    const UserToModify = await User.findById(req.body._id);
    if (!UserToModify) {
      req.flash("error", "user not found");
      return res.redirect('back');
    }
    // const KeysToModify = Object.keys(req.body.toModify);
    // for (const key of KeysToModify) {
    //   UserToModify[key] = req.body.toModify[key];
    // }
    let modify = false;
    if (UserToModify.lastName != req.body.lastName) {
      UserToModify.lastName = req.body.lastName;
      modify = true;
    }
    if (UserToModify.firstName != req.body.firstName) {
      UserToModify.firstName = req.body.firstName;
      modify = true;
    }
    if (shortDate(UserToModify.birthdate) != req.body.birthdate) {
      UserToModify.birthdate = req.body.birthdate;
      modify = true;
    }
    if (UserToModify.role != req.body.role) {
      UserToModify.role = req.body.role;
      modify = true;
    }
    await UserToModify.save();
    if (modify) {
      req.flash("info", "User successfully modified");
    }
    return res.redirect("/users");
  } catch (error) {
    return res.json(error.message);
  }
}

padTo2Digits = function(num) {
  return num.toString().padStart(2, '0');
}

shortDate = function(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

module.exports = { usersGet, userCreate, userDelete, userUpdate, userGet };

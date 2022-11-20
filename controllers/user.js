const encryptPassword = require("../utils/encryptPassword");
const { errorMessage, capitalize } = require("../utils/utils");

async function usersGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const MyUsers = await User.find();
    return res.render("users.ejs", {user: req.user, users: MyUsers});
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function userGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const user = await User.findById(req.query.id);
    return res.render("user.ejs", {user: req.user, myUser: user});
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function userCreate(req, res) {
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
    
    const {token, salt, hash} = encryptPassword(req.body.password);
    const User = req.app.get("models").User;

    await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      birthdate: req.body.birthdate,
      role: req.body.role
    }).save();

    req.flash("info", "User successfully created");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function userDelete(req, res) {
  if (req.user.role !== "manager") {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  try {
    if (!req.body._id) {
      req.flash("error", "_id missing");
      return res.redirect("back");
    }
    if (req.body._id == req.user.id) {
      req.flash("error", "You can not delete yourself");
      return res.redirect("back");
    }
    const User = req.app.get("models").User;
    const UserToDelete = await User.findById(req.body._id);
    if (!UserToDelete) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    if (UserToDelete.role == "coach") {
      const Coach = req.app.get("models").Coach;
      const coachToDelete = await Coach.findOne({user: UserToDelete._id});
      if (!coachToDelete) {
        req.flash("error", "Coach not found");
        return res.redirect("back");
      }
      await coachToDelete.remove();
    }
    if (UserToDelete.role == "customer") {
      const Customer = req.app.get("models").Customer;
      const customerToDelete = await Customer.findOne({user: UserToDelete._id});
      if (!customerToDelete) {
        req.flash("error", "Customer not found");
        return res.redirect("back");
      }
      await customerToDelete.remove();
    }
    await UserToDelete.remove();
    let userType = capitalize(UserToDelete.role);
    req.flash("info", `${userType} Successfully deleted`);
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function userUpdate(req, res) {
  if (req.user.role !== "manager") {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  try {
    if (!req.body._id) {
      req.flash("error", "_id or modify fields missing");
      return res.redirect('back');
    }
    if (!req.body.lastName) {
      req.flash("error", "Lastname fields missing");
      return res.redirect('back');
    }
    if (!req.body.firstName) {
      req.flash("error", "Firstname fields missing");
      return res.redirect('back');
    }
    if (!req.body.birthdate) {
      req.flash("error", "Birthdate fields missing");
      return res.redirect('back');
    }
    if (!req.body.role) {
      req.flash("error", "Role fields missing");
      return res.redirect('back');
    }
    const User = req.app.get("models").User;
    const UserToModify = await User.findById(req.body._id);
    if (!UserToModify) {
      req.flash("error", "User not found");
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
      if (UserToModify.role == "coach") {
        const coach = req.app.get("models").Coach;
        const coachToDelete = coach.findOne({user: UserToModify._id});
        if (!coachToDelete) {
          req.flash("error", "Coach not found");
          return res.redirect("back");
        }
        await coachToDelete.remove();
      }
      if (UserToModify.role == "customer") {
        const customer = req.app.get("models").Customer;
        const customerToDelete = customer.findOne({user: UserToModify._id});
        if (!customerToDelete) {
          req.flash("error", "Customer not found");
          return res.redirect("back");
        }
        await customerToDelete.remove();
      }
      UserToModify.role = req.body.role;
      if (UserToModify.role == "coach") {
        const coach = req.app.get("models").Coach;
        await new coach({
          user: UserToModify._id,
          bio: "No bio for this coach",
          discipline: "Multisport",
          slots: []
        }).save();
      }
      if (UserToModify.role == "customer") {
        const customer = req.app.get("models").Customer;
        await new customer({
          user: UserToModify._id,
          subcriptions: [],
          level: "beginner"
        }).save();
      }
      modify = true;
    }
    await UserToModify.save();
    if (modify) {
      req.flash("info", "User successfully modified");
    }
    return res.redirect("/users");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/users");
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

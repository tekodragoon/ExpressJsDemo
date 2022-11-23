const encryptPassword = require("../utils/encryptPassword");
const { errorMessage, capitalize } = require("../utils/utils");

async function usersGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const MyUsers = await User.find();
    return res.render("users.ejs", { user: req.user, users: MyUsers });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

async function userGet(req, res) {
  try {
    const User = req.app.get("models").User;
    const user = await User.findById(req.query.id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    if (user.role === "coach") {
      const Coach = req.app.get("models").Coach;
      const coach = await Coach.findOne({ user: user._id });
      return res.render("user.ejs", {
        user: req.user,
        myUser: user,
        myCoach: coach,
        referer: req.headers.referer,
      });
    }
    if (user.role === "customer") {
      const Customer = req.app.get("models").Customer;
      const customer = await Customer.findOne({ user: user._id });
      return res.render("user.ejs", {
        user: req.user,
        myUser: user,
        myCustomer: customer,
        referer: req.headers.referer,
      });
    }
    return res.render("user.ejs", {
      user: req.user,
      myUser: user,
      referer: req.headers.referer,
    });
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
      return res.redirect("back");
    }
    if (!req.body.firstName) {
      req.flash("error", errorMessage("Firstname"));
      return res.redirect("back");
    }
    if (!req.body.birthdate) {
      req.flash("error", errorMessage("Birthdate"));
      return res.redirect("back");
    }
    if (!req.body.role) {
      req.flash("error", errorMessage("Role"));
      return res.redirect("back");
    }
    if (!req.body.login) {
      req.flash("error", errorMessage("Login"));
      return res.redirect("back");
    }
    if (!req.body.password) {
      req.flash("error", errorMessage("Password"));
      return res.redirect("back");
    }

    const { token, salt, hash } = encryptPassword(req.body.password);
    const User = req.app.get("models").User;

    await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      birthdate: req.body.birthdate,
      role: req.body.role,
      login: req.body.login,
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
      req.flash("error", "Id missing");
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
      const coachToDelete = await Coach.findOne({ user: UserToDelete._id });
      if (!coachToDelete) {
        req.flash("error", "Coach not found");
        return res.redirect("back");
      }
      await coachToDelete.remove();
    }
    if (UserToDelete.role == "customer") {
      const Customer = req.app.get("models").Customer;
      const customerToDelete = await Customer.findOne({
        user: UserToDelete._id,
      });
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
  // if (req.user.role !== "manager") {
  //   req.flash("error", "Unauthorized");
  //   return res.redirect("back");
  // }
  try {
    if (!req.body._id) {
      req.flash("error", "Id missing");
      return res.redirect("back");
    }
    if (!req.body.lastName) {
      req.flash("error", "Lastname fields missing");
      return res.redirect("back");
    }
    if (!req.body.firstName) {
      req.flash("error", "Firstname fields missing");
      return res.redirect("back");
    }
    if (!req.body.birthdate) {
      req.flash("error", "Birthdate fields missing");
      return res.redirect("back");
    }
    const models = req.app.get("models");
    const UserToModify = await models.User.findById(req.body._id);
    if (!UserToModify) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    let modify = false;
    let coachModify = false;
    let customerModify = false;
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
    if (UserToModify.role === "coach") {
      if (!req.body.discipline) {
        req.flash("error", "Discipline fields missing");
        return res.redirect("back");
      }
      if (!req.body.bio) {
        req.flash("error", "Bio fields missing");
        return res.redirect("back");
      }
      const CoachToModify = await models.Coach.findOne({
        user: UserToModify._id,
      });
      if (!CoachToModify) {
        req.flash("error", "Coach not found");
        return res.redirect("back");
      }
      if (CoachToModify.discipline != req.body.discipline) {
        CoachToModify.discipline = req.body.discipline;
        coachModify = true;
      }
      if (CoachToModify.bio != req.body.bio) {
        CoachToModify.bio = req.body.bio;
        coachModify = true;
      }
      if (coachModify) {
        await CoachToModify.save();
      }
    }
    if (UserToModify.role === "customer") {
      if (!req.body.level) {
        req.flash("error", "Level fields missing");
        return res.redirect("back");
      }
      const CustomerToModify = await models.Customer.findOne({
        user: UserToModify._id,
      });
      if (!CustomerToModify) {
        req.flash("error", "Customer not found");
        return res.redirect("back");
      }
      if (CustomerToModify.level != req.body.level) {
        CustomerToModify.level = req.body.level;
        customerModify = true;
      }
      if (customerModify) {
        await CustomerToModify.save();
      }
    }
    if (modify) {
      await UserToModify.save();
    }
    if (modify || coachModify || customerModify) {
      req.flash("info", "Information Successfully modified");
    }
    return res.redirect(req.body.referer);
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/users");
  }
}

async function userUpdateRole(req, res) {
  if (req.user.role !== "manager") {
    req.flash("error", "Unauthorized");
    return res.redirect("back");
  }
  try {
    if (!req.body._id) {
      req.flash("error", "_id fields missing");
      return res.redirect("back");
    }
    if (!req.body.role) {
      req.flash("error", "Role fields missing");
      return res.redirect("back");
    }
    const models = req.app.get("models");
    const UserToModify = await models.User.findById(req.body._id);
    if (!UserToModify) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    let modify = false;
    if (UserToModify.role != req.body.role) {
      if (UserToModify.role == "coach") {
        const coach = req.app.get("models").Coach;
        const coachToDelete = coach.findOne({ user: UserToModify._id });
        if (!coachToDelete) {
          req.flash("error", "Coach not found");
          return res.redirect("back");
        }
        await coachToDelete.remove();
      }
      if (UserToModify.role == "customer") {
        const customer = req.app.get("models").Customer;
        const customerToDelete = customer.findOne({ user: UserToModify._id });
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
          slots: [],
        }).save();
      }
      if (UserToModify.role == "customer") {
        const customer = req.app.get("models").Customer;
        await new customer({
          user: UserToModify._id,
          subcriptions: [],
          level: "beginner",
        }).save();
      }
      modify = true;
    }
    if (modify) {
      await UserToModify.save();
      req.flash("info", "User Role Successfully modified");
    }
    return res.redirect("/users");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/users");
  }
}

async function userAccount(req, res) {
  try {
    const models = req.app.get("models");
    const currentUser = await models.User.findById(req.user._id);
    if (!currentUser) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    if (currentUser.role === "coach") {
      const coach = await models.Coach.findOne({user: currentUser._id});
      if (!coach) {
        req.flash("error", "Coach info not found");
        return res.redirect("back");
      }
      return res.render("account.ejs", {
        user: currentUser,
        coach: coach
      });
    }
    if (currentUser.role === "customer") {
      const customer = await models.Customer.findOne({user: currentUser._id});
      if (!customer) {
        req.flash("error", "Customer info not found");
        return res.redirect("back");
      }
      return res.render("account.ejs", {
        user: currentUser,
        customer: customer
      });
    }
    return res.render("account.ejs", {
      user: currentUser
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("back");
  }
}

padTo2Digits = function (num) {
  return num.toString().padStart(2, "0");
};

shortDate = function (date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
};

module.exports = {
  usersGet,
  userCreate,
  userDelete,
  userUpdate,
  userGet,
  userUpdateRole,
  userAccount,
};

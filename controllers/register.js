const queryString = require("querystring");
const encryptPassword = require("../utils/encryptPassword");

async function registerGet(req, res) {
  if (req.query.error) {
    return res.render('register.ejs', {
      errorMessage: req.query.error
    });
  }
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

    const User = req.app.get("models").User;

    const alreadyExist = await User.findOne({login: req.body.login});
    console.log(alreadyExist);
    if (alreadyExist) {
      req.flash("error", "login already used");
      return res.redirect("back");
    }

    const NewUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      birthdate: new Date("2030-01-01"),
      login: req.body.login,
    }).save();
    return res.redirect("/login");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = {registerGet, registerPost};
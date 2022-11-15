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
      const query = queryString.stringify({
        error : "No lastName provided"
      });
      return res.redirect("/register?" + query);
    }
    if (!req.body.firstName) {
      const query = queryString.stringify({
        error : "No firstName provided"
      });
      return res.redirect("/register?" + query);
    }
    if (!req.body.login) {
      const query = queryString.stringify({
        error : "No login provided"
      });
      return res.redirect("/register?" + query);
    }
    if (!req.body.password) {
      const query = queryString.stringify({
        error : "No password provided"
      });
      return res.redirect("/register?" + query);
    }

    //todo: gestion utilisateur unique
    //todo: gestion birthdate on register

    const {token, salt, hash} = encryptPassword(req.body.password);

    const User = req.app.get("models").User;

    const NewUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      token,
      salt,
      hash,
      dateOfBirth: new Date(),
      login: req.body.login,
    }).save();
    return res.redirect("/login");
  } catch (error) {
    return res.json(error.message);
  }
}

module.exports = {registerGet, registerPost};
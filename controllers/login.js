async function loginGet(req, res) {
  if (req.query.error) {
    return res.render('login.ejs', {
      errorMessage: req.query.error
    });
  }
  return res.render('login.ejs');
}

module.exports = loginGet;
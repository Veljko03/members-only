async function mainPage(req, res) {
  res.render("index", { user: req.user });
}

module.exports = {
  mainPage,
};

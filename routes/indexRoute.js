const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const pool = require("../db/pool");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/", indexController.mainPage);
router.get("/sign-up", (req, res) => res.render("sign-up-form"));
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/sign-up", async (req, res, next) => {
  const { full_name, username, password, confirm } = req.body;
  console.log(
    `full nmae: ${full_name} username: ${username} password ${password} confirm ${confirm}`
  );
  if (password !== confirm) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return;
      }
      await pool.query(
        "INSERT INTO users (full_name,username, password) VALUES ($1, $2,$3)",
        [req.body.full_name, req.body.username, hashedPassword]
      );
    });

    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
module.exports = router;

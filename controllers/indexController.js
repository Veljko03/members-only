const db = require("../db/queries");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { validationResult, body } = require("express-validator");

async function mainPage(req, res) {
  const posts = await db.getAllPosts();

  console.log("user ", req.user);

  res.render("index", { user: req.user, posts: posts });
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function getMembership(req, res) {
  res.render("membership", { user: req.user });
}

async function postMembership(req, res) {
  const { answer } = req.body;
  console.log(req.user, " user");

  console.log(answer);
  if (answer == "11") {
    await db.updateUserMembership(req.user);
    res.redirect("/");
  } else {
    res.redirect("/membership");
  }
}

function singUpForm(req, res) {
  res.render("sign-up-form");
}

// exports.signUpFormPost = [
//   validateUser,
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).render("new-post-form", {
//         errors: errors.array(),
//       });
//     }
//     const { full_name, username, password, confirm } = req.body;
//     try {
//       bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
//         if (err) {
//           return;
//         }
//         await db.insertNewUser(full_name, username, hashedPassword);
//       });

//       res.redirect("/log-in");
//     } catch (err) {
//       return next(err);
//     }
//   },
// ];
async function signUpFormPost(req, res, next) {
  const errors = validationResult(req);

  // Ako validacija ima greške, prikaži ih korisniku
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errors: errors.array(), // Prosledi greške view-u
    });
  }
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
      await db.insertNewUser(full_name, username, hashedPassword);
    });

    res.redirect("/log-in");
  } catch (err) {
    return next(err);
  }
}

async function createNewMessageGet(req, res) {
  res.render("new-post-form", { user: req.user });
}

async function logInPost(req, res, next) {
  console.log("dosao ovde");

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })(req, res, next);
}

async function createNewMessagePost(req, res) {
  const { title, mess } = req.body;
  const { id } = req.user;

  await db.insertNewMessage(title, mess, id);
  res.redirect("/");
}

module.exports = {
  mainPage,
  createNewMessagePost,
  createNewMessageGet,
  singUpForm,
  logout,
  logInPost,
  signUpFormPost,
  getMembership,
  postMembership,
};

const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const { body, validationResult } = require("express-validator");

const validateUser = [
  body("full_name")
    .trim()
    .isLength({ min: 4, max: 25 })
    .withMessage("Full name must be between 4 and 10 characters."),

  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers.")
    .isLength({ min: 4, max: 10 })
    .withMessage("Username must be between 4 and 10 characters."),

  body("password")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters."),

  body("confirm")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."), // Custom validator to check if password matches
];

router.get("/", indexController.mainPage);
router.get("/log-in", (req, res) => res.render("log-in-form"));
router.get("/create-post", indexController.createNewMessageGet);

router.get("/membership", indexController.getMembership);
router.get("/sign-up", indexController.singUpForm);
router.get("/log-out", indexController.logout);

router.post("/sign-up", validateUser, indexController.signUpFormPost);
router.post("/log-in", indexController.logInPost);
router.post("/create-post", indexController.createNewMessagePost);
router.post("/membership", indexController.postMembership);
module.exports = router;

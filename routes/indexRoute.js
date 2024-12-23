const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.mainPage);
router.get("/log-in", (req, res) => res.render("log-in-form"));
router.get("/create-post", indexController.createNewMessageGet);

router.post("/create-post", indexController.createNewMessagePost);

router.get("/sign-up", indexController.singUpForm);
router.get("/log-out", indexController.logout);

router.post("/sign-up", indexController.signUpFormPost);
router.post("/log-in", indexController.logInPost);
module.exports = router;

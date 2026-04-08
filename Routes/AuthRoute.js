const express = require("express");
const registerController = require("@/Https/Controllers/Auth/RegisterController");
const LoginController = require("@/Https/Controllers/Auth/Login.Controller");
const {
	validateLoginInput,
	validateRegisterInput,
} = require("@/Https/Middleware/AuthValidation");
const router = express.Router();

router.get("/register", (req, res) => res.render("auth/register"));

router.post("/register", validateRegisterInput, registerController);

router.post("/login", validateLoginInput, LoginController);

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/logout", (req, res) => {
	req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;

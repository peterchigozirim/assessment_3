const express = require("express");
const router = express.Router();

const {
	default: UserController,
} = require("@/Https/Controllers/Api/UserController");
const {
	default: verifyTokenMiddleware,
} = require("@/Https/Middleware/VerfiyToken");

router.get("/profile", verifyTokenMiddleware, UserController.index);

module.exports = router;

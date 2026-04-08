const express = require("express");
const router = express.Router();
const verifyTokenMiddleware = require("@/Https/Middleware/VerfiyToken");
const TaskController = require("@/Https/Controllers/Api/TaskController");

router.get("/tasks", verifyTokenMiddleware, TaskController.index);
router.post("/tasks", verifyTokenMiddleware, TaskController.create);
router.put("/tasks/:id", verifyTokenMiddleware, TaskController.update);

module.exports = router;

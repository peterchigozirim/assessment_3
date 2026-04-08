const express = require("express");
const router = express.Router();
const TaskController = require("@/Https/Controllers/Api/TaskController");
const { requireAuth } = require("@/Https/Middleware/SessionAuth");

router.get(["/", "/tasks"], requireAuth, TaskController.index);
router.post("/tasks", requireAuth, TaskController.create);
router.post("/tasks/:id/toggle", requireAuth, TaskController.update);
router.post("/tasks/:id/delete", requireAuth, TaskController.destroy);

module.exports = router;

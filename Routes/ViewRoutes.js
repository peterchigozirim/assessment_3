const express = require("express");
const User = require("@/Models/User");
const Task = require("@/Models/Task");
const { requireAuth } = require("@/Https/Middleware/SessionAuth");

const router = express.Router();

router.get("/login", (req, res) => res.render("auth/login"));
router.get("/register", (req, res) => res.render("auth/register"));

router.post("/logout", (req, res) => {
	req.session.destroy(() => res.redirect("/login"));
});

router.get(["/", "/tasks"], requireAuth, async (req, res) => {
	const tasks = await Task.find({ user: req.user.id }).sort({ _id: -1 });
	return res.render("tasks/index", { tasks });
});

router.post("/tasks", requireAuth, async (req, res) => {
	const { title } = req.body;
	if (!title) {
		req.flash("error", "Title is required");
		return res.redirect("/tasks");
	}
	await Task.create({ title, user: req.user.id });
	req.flash("success", "Task added");
	return res.redirect("/tasks");
});

router.post("/tasks/:id/toggle", requireAuth, async (req, res) => {
	const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
	if (!task) {
		req.flash("error", "Task not found");
		return res.redirect("/tasks");
	}
	const nextStatus = task.status === "completed" ? "pending" : "completed";
	await Task.updateOne({ _id: task._id }, { status: nextStatus });
	return res.redirect("/tasks");
});

router.post("/tasks/:id/delete", requireAuth, async (req, res) => {
	await Task.findOneAndUpdate(
		{ _id: req.params.id, user: req.user.id },
		{ status: "deleted" },
	);
	return res.redirect("/tasks");
});

// Session login/register handlers for the UI (username+password = email+password here)
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email?.toLowerCase().trim() });
	if (!user) {
		req.flash("error", "Credentials not found.");
		return res.redirect("/login");
	}
	const ok = await user.comparePassword(password);
	if (!ok) {
		req.flash("error", "Invalid password.");
		return res.redirect("/login");
	}
	const token = user.generateAuthToken();
	req.session.token = token;
	req.session.user = {
		id: user._id.toString(),
		email: user.email,
		name: user.name,
	};
	return res.redirect("/tasks");
});

router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		req.flash("error", "All fields are required");
		return res.redirect("/register");
	}
	if (password.length < 8) {
		req.flash("error", "Password must be at least 8 characters long");
		return res.redirect("/register");
	}
	const existing = await User.findOne({ email });
	if (existing) {
		req.flash("error", "User already exists");
		return res.redirect("/register");
	}
	const user = await User.create({ name, email, password });
	const token = user.generateAuthToken();
	req.session.token = token;
	req.session.user = {
		id: user._id.toString(),
		email: user.email,
		name: user.name,
	};
	return res.redirect("/tasks");
});

module.exports = router;

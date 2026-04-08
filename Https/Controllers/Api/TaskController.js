const Task = require("@/Models/Task");

class TaskController {
	index = async (req, res) => {
		const tasks = await Task.find({ user: req.user.id }).sort({ _id: -1 });
		return res.render("tasks/index", { tasks });
	};

	create = async (req, res) => {
		const { title } = req.body;
		if (!title) {
			req.flash("error", "Title is required");
			return res.redirect("/tasks");
		}
		await Task.create({ title, user: req.user.id });
		req.flash("success", "Task added");
		return res.redirect("/tasks");
	};

	update = async (req, res) => {
		const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
		if (!task) {
			req.flash("error", "Task not found");
			return res.redirect("/tasks");
		}
		const nextStatus = task.status === "completed" ? "pending" : "completed";
		await Task.updateOne({ _id: task._id }, { status: nextStatus });
		return res.redirect("/tasks");
	};

	destroy = async (req, res) => {
		const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
		if (!task) {
			req.flash("error", "Task not found");
			return res.redirect("/tasks");
		}
		await Task.deleteOne({ _id: task._id });
		req.flash("success", "Task deleted");
		return res.redirect("/tasks");
	};
}

module.exports = new TaskController();

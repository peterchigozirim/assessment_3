const Task = require("../../Models/Task");

class TaskController {
	index = async (req, res) => {
		try {
			const tasks = await Task.find({ user: req.user.id });
			return res.status(200).json({ tasks });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error." });
		}
	};

	create = async (req, res) => {
		try {
			const { title } = req.body;
			if (!title) {
				return res.status(400).json({ message: "Title is required." });
			}
			const task = await Task.create({
				title,
				user: req.user.id,
			});
			return res
				.status(201)
				.json({ message: "Task created successfully.", task });
		} catch (error) {
			return res.status(500).json({ message: "Internal server error." });
		}
	};

	update = async (req, res) => {
		try {
			const { id } = req.params;
			const { status, user } = req.body;
			if (!status) {
				return res.status(400).json({ message: "Status is required." });
			}
			if (!req.user.id) {
				return res.status(403).json({ message: "Unauthorized." });
			}

			const task = await Task.findOneAndUpdate(
				{ _id: id, user: req.user.id },
				{ status },
				{ new: true },
			);

			res.json(task);
		} catch (err) {
			next(err);
		}
	};
}

module.exports = new TaskController();

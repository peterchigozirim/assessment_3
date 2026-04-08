import { verifyToken } from "@/Plugins/jwt";

const User = require("@/Models/User");

class UserController {
	index = async (req, res) => {
		try {
			const { id } = req.params;

			const user = await User.findById(id).select("-password");
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			res.status(200).json({ user });
		} catch (error) {
			res.status(401).json({ message: "Invalid token" });
		}
	};

	update = async (req, res) => {
		try {
			const { id } = req.params;
			const { name, email, password } = req.body;

			const user = await User.findById(id);
			if (!user) {
				return res.status(404).json({ message: "User not found." });
			}

			if (name) user.name = name;
			if (email) user.email = email.toLowerCase().trim();
			if (password) user.password = password;

			await user.save();
			return res.json({ message: "User updated successfully.", user });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error." });
		}
	};
}

export default new UserController();

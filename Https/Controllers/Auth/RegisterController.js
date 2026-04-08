const User = require("@/Models/User");

const registerController = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password });
		const token = await user.generateAuthToken({
			email: user.email,
			userId: user._id,
		});
		return res
			.status(201)
			.json({ message: "User created successfully", user, token });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

module.exports = registerController;
